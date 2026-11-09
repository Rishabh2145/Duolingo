import json
import unicodedata
import datetime
import sqlite3
from fastapi import APIRouter, Depends, HTTPException
from database import get_db, row_to_dict
from schemas import (
    SubmitAnswerRequest, SubmitAnswerResponse,
    CompleteLessonRequest, CompleteLessonResponse
)

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


def normalize_text(text: str) -> str:
    """Normalize text by trimming, lowercasing, stripping punctuation and accents for generous matching."""
    if not text:
        return ""
    text = text.strip().lower()
    for ch in [".", ",", "!", "?", "¿", "¡", '"', "'", ";", ":"]:
        text = text.replace(ch, "")
    normalized = unicodedata.normalize("NFKD", text)
    without_accents = "".join(c for c in normalized if not unicodedata.combining(c))
    return " ".join(without_accents.split())


@router.get("/{lesson_id}")
def get_lesson(lesson_id: int, conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM lessons WHERE id = ?", (lesson_id,))
    l_row = cursor.fetchone()
    if not l_row:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lesson = row_to_dict(l_row)

    cursor.execute("SELECT hearts FROM users LIMIT 1")
    user_row = cursor.fetchone()
    user_hearts = user_row["hearts"] if user_row else 5

    cursor.execute(
        'SELECT * FROM exercises WHERE lesson_id = ? ORDER BY "order" ASC',
        (lesson_id,)
    )
    exercises_rows = cursor.fetchall()

    exercises_out = []
    for ex in exercises_rows:
        options = json.loads(ex["options_json"]) if ex["options_json"] else None
        hints = json.loads(ex["hints_json"]) if ex["hints_json"] else None
        correct_raw = json.loads(ex["correct_answer_json"]) if ex["correct_answer_json"] else None

        exercises_out.append({
            "id": ex["id"],
            "lesson_id": ex["lesson_id"],
            "order": ex["order"],
            "exercise_type": ex["exercise_type"],
            "prompt": ex["prompt"],
            "question_text": ex["question_text"],
            "audio_text": ex["audio_text"],
            "options": options,
            "correct_answer": correct_raw,
            "context_sentence": ex["context_sentence"],
            "hints": hints,
        })

    return {
        "id": lesson["id"],
        "title": lesson["title"],
        "skill_id": lesson["skill_id"],
        "order": lesson["order"],
        "xp_reward": lesson["xp_reward"],
        "hearts": user_hearts,
        "exercises": exercises_out
    }


@router.post("/submit-answer", response_model=SubmitAnswerResponse)
def submit_answer(req: SubmitAnswerRequest, conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM exercises WHERE id = ?", (req.exercise_id,))
    ex_row = cursor.fetchone()
    if not ex_row:
        raise HTTPException(status_code=404, detail="Exercise not found")
    exercise = row_to_dict(ex_row)

    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = row_to_dict(user_row)

    correct_data = json.loads(exercise["correct_answer_json"])
    user_answer = req.answer
    is_correct = False
    display_correct = correct_data

    ex_type = exercise["exercise_type"]
    if ex_type == "multiple_choice":
        is_correct = (str(user_answer).strip() == str(correct_data).strip())

    elif ex_type == "translate":
        if isinstance(user_answer, list) and isinstance(correct_data, list):
            user_joined = " ".join(str(w).strip().lower() for w in user_answer)
            correct_joined = " ".join(str(w).strip().lower() for w in correct_data)
            is_correct = (normalize_text(user_joined) == normalize_text(correct_joined))
        elif isinstance(user_answer, str) and isinstance(correct_data, list):
            correct_joined = " ".join(str(w).strip().lower() for w in correct_data)
            is_correct = (normalize_text(user_answer) == normalize_text(correct_joined))
        elif isinstance(user_answer, str) and isinstance(correct_data, str):
            is_correct = (normalize_text(user_answer) == normalize_text(correct_data))

    elif ex_type == "match_pairs":
        if isinstance(user_answer, dict) and isinstance(correct_data, dict):
            matches = True
            for k, v in correct_data.items():
                if user_answer.get(k) != v and user_answer.get(v) != k:
                    matches = False
                    break
            is_correct = matches
        else:
            is_correct = False

    elif ex_type == "fill_in_the_blank":
        is_correct = (normalize_text(str(user_answer)) == normalize_text(str(correct_data)))

    elif ex_type == "type_the_answer":
        norm_user = normalize_text(str(user_answer))
        if isinstance(correct_data, list):
            is_correct = any(normalize_text(str(ans)) == norm_user for ans in correct_data)
            display_correct = correct_data[0]
        else:
            is_correct = (normalize_text(str(correct_data)) == norm_user)

    hearts_rem = user["hearts"]
    if not is_correct and hearts_rem > 0:
        hearts_rem -= 1
        cursor.execute("UPDATE users SET hearts = ? WHERE id = ?", (hearts_rem, user["id"]))
        conn.commit()

    return SubmitAnswerResponse(
        is_correct=is_correct,
        correct_answer=display_correct,
        hearts_remaining=hearts_rem,
        message="Nicely done!" if is_correct else "Incorrect answer"
    )


@router.post("/complete", response_model=CompleteLessonResponse)
def complete_lesson(req: CompleteLessonRequest, conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM lessons WHERE id = ?", (req.lesson_id,))
    l_row = cursor.fetchone()
    if not l_row:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lesson = row_to_dict(l_row)

    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = row_to_dict(user_row)

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    # Mark or update progress
    cursor.execute(
        """
        INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, score)
        VALUES (?, ?, 1, ?, ?)
        ON CONFLICT(user_id, lesson_id) DO UPDATE SET
            completed = 1,
            completed_at = excluded.completed_at,
            score = MAX(user_progress.score, excluded.score)
        """,
        (user["id"], lesson["id"], now, req.score)
    )

    xp_earned = lesson["xp_reward"]
    new_total_xp = user["xp"] + xp_earned
    new_today_xp = user["today_xp"] + xp_earned
    gems_earned = 15
    new_gems = user["gems"] + gems_earned

    # Handle Streak Logic
    today_str = datetime.date.today().isoformat()
    yesterday_str = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
    streak_extended = False
    current_streak = user["streak"]

    if user["last_active_date"] == today_str:
        streak_extended = False
    elif user["last_active_date"] == yesterday_str:
        current_streak += 1
        streak_extended = True
    else:
        current_streak = 1
        streak_extended = True

    new_max_streak = max(user["max_streak"], current_streak)

    cursor.execute(
        """
        UPDATE users SET
            xp = ?,
            today_xp = ?,
            gems = ?,
            streak = ?,
            max_streak = ?,
            last_active_date = ?
        WHERE id = ?
        """,
        (new_total_xp, new_today_xp, new_gems, current_streak, new_max_streak, today_str, user["id"])
    )

    # Update leaderboard user entry
    cursor.execute(
        "UPDATE leaderboard SET xp = ? WHERE is_current_user = 1",
        (new_total_xp,)
    )

    # Check achievements
    cursor.execute("SELECT * FROM user_achievements WHERE user_id = ?", (user["id"],))
    ach_rows = cursor.fetchall()
    unlocked_badges = []

    for a in ach_rows:
        ach = row_to_dict(a)
        new_prog = ach["current_progress"]
        should_unlock = False

        if ach["badge_key"] == "wildfire":
            new_prog = current_streak
            if new_prog >= ach["target_progress"] and not ach["unlocked"]:
                should_unlock = True
        elif ach["badge_key"] == "sage":
            new_prog = new_total_xp
            if new_prog >= ach["target_progress"] and not ach["unlocked"]:
                should_unlock = True
        elif ach["badge_key"] == "sharpshooter":
            if req.hearts_lost == 0:
                new_prog += 1
                if new_prog >= ach["target_progress"] and not ach["unlocked"]:
                    should_unlock = True

        if should_unlock:
            unlocked_badges.append(ach["title"])
            cursor.execute(
                "UPDATE user_achievements SET current_progress = ?, unlocked = 1 WHERE id = ?",
                (new_prog, ach["id"])
            )
        elif new_prog != ach["current_progress"]:
            cursor.execute(
                "UPDATE user_achievements SET current_progress = ? WHERE id = ?",
                (new_prog, ach["id"])
            )

    conn.commit()

    return CompleteLessonResponse(
        success=True,
        xp_earned=xp_earned,
        new_total_xp=new_total_xp,
        today_xp=new_today_xp,
        streak=current_streak,
        streak_extended=streak_extended,
        gems_earned=gems_earned,
        new_gems=new_gems,
        achievements_unlocked=unlocked_badges
    )

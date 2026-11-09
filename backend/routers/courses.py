import json
import sqlite3
from fastapi import APIRouter, Depends, HTTPException
from database import get_db, row_to_dict
from schemas import CoursePathResponse, LanguageBase, UnitSummary, SkillSummary, LessonSummary

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/path")
def get_course_path(conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()

    # Get User
    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = row_to_dict(user_row)

    # Get Language
    cursor.execute("SELECT * FROM languages WHERE id = ?", (user["active_language_id"],))
    lang_row = cursor.fetchone()
    if not lang_row:
        cursor.execute("SELECT * FROM languages LIMIT 1")
        lang_row = cursor.fetchone()
    if not lang_row:
        raise HTTPException(status_code=404, detail="Language not found")
    language = row_to_dict(lang_row)

    # Get Completed Lessons for User
    cursor.execute(
        "SELECT lesson_id FROM user_progress WHERE user_id = ? AND completed = 1",
        (user["id"],)
    )
    completed_lesson_ids = set(r["lesson_id"] for r in cursor.fetchall())

    # Get Units
    cursor.execute(
        'SELECT * FROM units WHERE language_id = ? ORDER BY "order" ASC',
        (language["id"],)
    )
    units_rows = cursor.fetchall()

    units_data = []
    previous_skill_completed = True
    current_skill_id = None
    current_lesson_id = None

    for u_row in units_rows:
        unit = row_to_dict(u_row)

        # Get Skills for this Unit
        cursor.execute(
            'SELECT * FROM skills WHERE unit_id = ? ORDER BY "order" ASC',
            (unit["id"],)
        )
        skills_rows = cursor.fetchall()
        skills_summary = []

        for s_row in skills_rows:
            skill = row_to_dict(s_row)

            # Get Lessons for this Skill
            cursor.execute(
                'SELECT * FROM lessons WHERE skill_id = ? ORDER BY "order" ASC',
                (skill["id"],)
            )
            lessons_rows = cursor.fetchall()
            lesson_summaries = []
            skill_completed_lessons = 0
            first_uncompleted_lesson = None

            for l_row in lessons_rows:
                lesson = row_to_dict(l_row)
                is_completed = lesson["id"] in completed_lesson_ids
                if is_completed:
                    skill_completed_lessons += 1
                elif first_uncompleted_lesson is None:
                    first_uncompleted_lesson = lesson["id"]

                # Count exercises
                cursor.execute(
                    "SELECT COUNT(*) as count FROM exercises WHERE lesson_id = ?",
                    (lesson["id"],)
                )
                ex_count = cursor.fetchone()["count"]

                lesson_summaries.append({
                    "id": lesson["id"],
                    "skill_id": lesson["skill_id"],
                    "order": lesson["order"],
                    "title": lesson["title"],
                    "xp_reward": lesson["xp_reward"],
                    "completed": is_completed,
                    "exercise_count": ex_count
                })

            total_lessons = len(lesson_summaries)
            is_skill_completed = (total_lessons > 0 and skill_completed_lessons >= total_lessons)

            if is_skill_completed:
                state = "completed"
            elif previous_skill_completed:
                state = "current"
                if current_skill_id is None:
                    current_skill_id = skill["id"]
                    current_lesson_id = first_uncompleted_lesson or (lesson_summaries[0]["id"] if lesson_summaries else None)
            else:
                state = "locked"

            progress_pct = int((skill_completed_lessons / total_lessons * 100)) if total_lessons > 0 else 0

            skills_summary.append({
                "id": skill["id"],
                "unit_id": skill["unit_id"],
                "order": skill["order"],
                "title": skill["title"],
                "icon": skill["icon"],
                "crowns_required": skill["crowns_required"],
                "total_lessons": total_lessons,
                "completed_lessons": skill_completed_lessons,
                "state": state,
                "progress_percentage": progress_pct,
                "lessons": lesson_summaries
            })

            previous_skill_completed = is_skill_completed

        units_data.append({
            "id": unit["id"],
            "language_id": unit["language_id"],
            "order": unit["order"],
            "title": unit["title"],
            "description": unit["description"],
            "color": unit["color"],
            "skills": skills_summary
        })

    if current_skill_id is None and units_data and units_data[0]["skills"]:
        current_skill_id = units_data[0]["skills"][0]["id"]
        if units_data[0]["skills"][0]["lessons"]:
            current_lesson_id = units_data[0]["skills"][0]["lessons"][0]["id"]

    return {
        "language": language,
        "units": units_data,
        "current_skill_id": current_skill_id,
        "current_lesson_id": current_lesson_id
    }

import datetime
import sqlite3
from fastapi import APIRouter, Depends, HTTPException
from database import get_db, row_to_dict
from schemas import (
    UserProfileResponse, AchievementResponse, HeartActionRequest,
    HeartActionResponse, SimulateStreakRequest
)

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserProfileResponse)
def get_current_user(conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users LIMIT 1")
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row_to_dict(row)


@router.post("/hearts", response_model=HeartActionResponse)
def handle_hearts(req: HeartActionRequest, conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = row_to_dict(user_row)

    if req.action == "refill":
        cost = 350
        if user["gems"] < cost:
            raise HTTPException(status_code=400, detail="Not enough gems to refill hearts")
        new_gems = user["gems"] - cost
        new_hearts = user["max_hearts"]
        cursor.execute("UPDATE users SET gems = ?, hearts = ? WHERE id = ?", (new_gems, new_hearts, user["id"]))
        msg = "Hearts fully refilled with gems!"
    elif req.action == "practice":
        new_hearts = min(user["max_hearts"], user["hearts"] + 1)
        new_gems = user["gems"]
        cursor.execute("UPDATE users SET hearts = ? WHERE id = ?", (new_hearts, user["id"]))
        msg = "Earned 1 heart from practice!"
    elif req.action == "reset":
        new_hearts = user["max_hearts"]
        new_gems = user["gems"]
        cursor.execute("UPDATE users SET hearts = ? WHERE id = ?", (new_hearts, user["id"]))
        msg = "Hearts reset to full!"
    else:
        raise HTTPException(status_code=400, detail="Unknown heart action")

    conn.commit()
    return HeartActionResponse(
        success=True,
        message=msg,
        hearts=new_hearts,
        gems=new_gems
    )


@router.get("/achievements")
def get_user_achievements(conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = row_to_dict(user_row)

    cursor.execute("SELECT * FROM user_achievements WHERE user_id = ?", (user["id"],))
    rows = cursor.fetchall()
    return [row_to_dict(r) for r in rows]


@router.post("/simulate-streak")
def simulate_streak(req: SimulateStreakRequest, conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    user = row_to_dict(user_row)

    if req.action == "advance_day":
        yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
        cursor.execute(
            "UPDATE users SET last_active_date = ?, today_xp = 0 WHERE id = ?",
            (yesterday, user["id"])
        )
        msg = f"Simulated new day! Last active set to yesterday ({yesterday}). Completing a lesson will now increase streak to {user['streak'] + 1}."
        last_active = yesterday
    elif req.action == "skip_day":
        past = (datetime.date.today() - datetime.timedelta(days=3)).isoformat()
        cursor.execute(
            "UPDATE users SET last_active_date = ?, today_xp = 0 WHERE id = ?",
            (past, user["id"])
        )
        msg = f"Simulated skipped days. Last active set to {past}. Completing a lesson will reset streak."
        last_active = past
    elif req.action == "reset":
        today = datetime.date.today().isoformat()
        cursor.execute(
            "UPDATE users SET streak = 1, last_active_date = ?, today_xp = 0 WHERE id = ?",
            (today, user["id"])
        )
        msg = "Streak reset to 1."
        last_active = today
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    conn.commit()
    cursor.execute("SELECT streak FROM users WHERE id = ?", (user["id"],))
    updated_streak = cursor.fetchone()["streak"]

    return {
        "success": True,
        "message": msg,
        "streak": updated_streak,
        "last_active_date": last_active
    }


@router.put("/daily-goal")
def update_daily_goal(goal: int, conn: sqlite3.Connection = Depends(get_db)):
    if goal not in [10, 20, 30, 50]:
        raise HTTPException(status_code=400, detail="Invalid daily goal value")
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET daily_xp_goal = ?", (goal,))
    conn.commit()
    return {"success": True, "daily_xp_goal": goal}

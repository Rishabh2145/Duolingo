import sqlite3
from fastapi import APIRouter, Depends
from database import get_db, row_to_dict
from schemas import LeaderboardResponse

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("")
def get_leaderboard(conn: sqlite3.Connection = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM leaderboard ORDER BY xp DESC")
    rows = cursor.fetchall()
    users_list = []
    for r in rows:
        d = row_to_dict(r)
        d["is_current_user"] = bool(d["is_current_user"])
        users_list.append(d)

    return {
        "league_name": "Silver League",
        "days_left": 3,
        "users": users_list
    }

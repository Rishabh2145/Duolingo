from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime


class LanguageBase(BaseModel):
    id: int
    code: str
    name: str
    flag: str
    total_learners: int

    class Config:
        from_attributes = True


class ExerciseSchema(BaseModel):
    id: int
    lesson_id: int
    order: int
    exercise_type: str
    prompt: str
    question_text: Optional[str] = None
    audio_text: Optional[str] = None
    options: Optional[Any] = None
    correct_answer: Optional[Any] = None
    context_sentence: Optional[str] = None
    hints: Optional[Dict[str, str]] = None

    class Config:
        from_attributes = True


class LessonSummary(BaseModel):
    id: int
    skill_id: int
    order: int
    title: str
    xp_reward: int
    completed: bool
    exercise_count: int

    class Config:
        from_attributes = True


class SkillSummary(BaseModel):
    id: int
    unit_id: int
    order: int
    title: str
    icon: str
    crowns_required: int
    total_lessons: int
    completed_lessons: int
    state: str  # "completed", "current", "locked"
    progress_percentage: int
    lessons: List[LessonSummary]

    class Config:
        from_attributes = True


class UnitSummary(BaseModel):
    id: int
    language_id: int
    order: int
    title: str
    description: str
    color: str
    skills: List[SkillSummary]

    class Config:
        from_attributes = True


class CoursePathResponse(BaseModel):
    language: LanguageBase
    units: List[UnitSummary]
    current_skill_id: Optional[int] = None
    current_lesson_id: Optional[int] = None


class UserProfileResponse(BaseModel):
    id: int
    username: str
    name: str
    email: str
    avatar: str
    streak: int
    max_streak: int
    xp: int
    gems: int
    hearts: int
    max_hearts: int
    daily_xp_goal: int
    today_xp: int
    last_active_date: str

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    badge_key: str
    title: str
    description: str
    icon: str
    current_level: int
    max_level: int
    current_progress: int
    target_progress: int
    unlocked: bool

    class Config:
        from_attributes = True


class LeaderboardUser(BaseModel):
    id: int
    username: str
    name: str
    avatar: str
    xp: int
    league: str
    is_current_user: bool

    class Config:
        from_attributes = True


class LeaderboardResponse(BaseModel):
    league_name: str
    days_left: int
    users: List[LeaderboardUser]


class SubmitAnswerRequest(BaseModel):
    exercise_id: int
    answer: Any


class SubmitAnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: Any
    hearts_remaining: int
    message: str


class CompleteLessonRequest(BaseModel):
    lesson_id: int
    hearts_lost: int = 0
    score: int = 100


class CompleteLessonResponse(BaseModel):
    success: bool
    xp_earned: int
    new_total_xp: int
    today_xp: int
    streak: int
    streak_extended: bool
    gems_earned: int
    new_gems: int
    achievements_unlocked: List[str]


class HeartActionRequest(BaseModel):
    action: str  # "refill" (costs 350 gems), "practice" (+1 heart), "reset" (full hearts)


class HeartActionResponse(BaseModel):
    success: bool
    message: str
    hearts: int
    gems: int


class SimulateStreakRequest(BaseModel):
    # Option to test streak logic: advance day, reset, or set specific date
    action: str  # "advance_day", "skip_day", "reset"

import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, DateTime, Text
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    avatar = Column(String(255), default="/duo_avatar.png")
    streak = Column(Integer, default=3)
    max_streak = Column(Integer, default=5)
    xp = Column(Integer, default=240)
    gems = Column(Integer, default=500)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    daily_xp_goal = Column(Integer, default=30)
    today_xp = Column(Integer, default=15)
    last_active_date = Column(String(20), default=datetime.date.today().isoformat())
    hearts_last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    active_language_id = Column(Integer, default=1)

    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    flag = Column(String(10), default="🇪🇸")
    total_learners = Column(Integer, default=14200000)

    units = relationship("Unit", back_populates="language", order_by="Unit.order")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    order = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    color = Column(String(20), default="#58cc02")

    language = relationship("Language", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    order = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    icon = Column(String(50), default="book")  # book, coffee, chat, star, target, trophy, apple
    crowns_required = Column(Integer, default=1)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    xp_reward = Column(Integer, default=15)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order")
    progress = relationship("UserProgress", back_populates="lesson")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order = Column(Integer, nullable=False)
    exercise_type = Column(String(50), nullable=False)  # multiple_choice, translate, match_pairs, fill_in_the_blank, type_the_answer
    prompt = Column(String(255), nullable=False)
    question_text = Column(String(255), nullable=True)
    audio_text = Column(String(255), nullable=True)
    options_json = Column(Text, nullable=True)         # JSON list of options or tokens
    correct_answer_json = Column(Text, nullable=False) # JSON: string or list of tokens or dict
    context_sentence = Column(String(255), nullable=True)
    hints_json = Column(Text, nullable=True)           # JSON dict: {"palabra": "word translation"}

    lesson = relationship("Lesson", back_populates="exercises")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
    score = Column(Integer, default=100)

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_key = Column(String(50), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon = Column(String(50), default="fire")
    current_level = Column(Integer, default=1)
    max_level = Column(Integer, default=5)
    current_progress = Column(Integer, default=3)
    target_progress = Column(Integer, default=7)
    unlocked = Column(Boolean, default=False)

    user = relationship("User", back_populates="achievements")


class LeaderboardEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    avatar = Column(String(255), default="/avatars/user1.png")
    xp = Column(Integer, default=0)
    league = Column(String(50), default="Silver League")
    is_current_user = Column(Boolean, default=False)

-- Duolingo SQLite Database Schema

PRAGMA foreign_keys = ON;

-- 1. Languages Table
CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    flag TEXT NOT NULL DEFAULT '🇪🇸',
    total_learners INTEGER DEFAULT 0
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar TEXT DEFAULT '/avatars/default.png',
    streak INTEGER DEFAULT 1,
    max_streak INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 500,
    hearts INTEGER DEFAULT 5,
    max_hearts INTEGER DEFAULT 5,
    daily_xp_goal INTEGER DEFAULT 30,
    today_xp INTEGER DEFAULT 0,
    last_active_date TEXT NOT NULL,
    active_language_id INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (active_language_id) REFERENCES languages(id) ON DELETE SET NULL
);

-- 3. Units Table
CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language_id INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT DEFAULT '#58cc02',
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon TEXT DEFAULT 'book',
    crowns_required INTEGER DEFAULT 1,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- 5. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    title TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 15,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 6. Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    exercise_type TEXT NOT NULL, -- 'multiple_choice', 'translate', 'match_pairs', 'fill_in_the_blank', 'type_the_answer'
    prompt TEXT NOT NULL,
    question_text TEXT,
    audio_text TEXT,
    options_json TEXT,         -- JSON array or object
    correct_answer_json TEXT NOT NULL, -- JSON string or array or dict
    context_sentence TEXT,
    hints_json TEXT,           -- JSON dict of translations
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 7. User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INTEGER DEFAULT 100,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE(user_id, lesson_id)
);

-- 8. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'flame',
    current_level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 5,
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER DEFAULT 1,
    unlocked BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, badge_key)
);

-- 9. Leaderboard Entries Table
CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    league TEXT DEFAULT 'Silver League',
    is_current_user BOOLEAN DEFAULT 0
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_units_lang ON units(language_id);
CREATE INDEX IF NOT EXISTS idx_skills_unit ON skills(unit_id);
CREATE INDEX IF NOT EXISTS idx_lessons_skill ON lessons(skill_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON leaderboard(xp DESC);

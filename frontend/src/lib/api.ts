const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar: string;
  streak: number;
  max_streak: number;
  xp: number;
  gems: number;
  hearts: number;
  max_hearts: number;
  daily_xp_goal: number;
  today_xp: number;
  last_active_date: string;
}

export interface LessonSummary {
  id: number;
  skill_id: number;
  order: number;
  title: string;
  xp_reward: number;
  completed: boolean;
  exercise_count: number;
}

export interface SkillSummary {
  id: number;
  unit_id: number;
  order: number;
  title: string;
  icon: string;
  crowns_required: number;
  total_lessons: number;
  completed_lessons: number;
  state: "completed" | "current" | "locked";
  progress_percentage: number;
  lessons: LessonSummary[];
}

export interface UnitSummary {
  id: number;
  language_id: number;
  order: number;
  title: string;
  description: string;
  color: string;
  skills: SkillSummary[];
}

export interface CoursePathResponse {
  language: {
    id: number;
    code: string;
    name: string;
    flag: string;
    total_learners: number;
  };
  units: UnitSummary[];
  current_skill_id: number | null;
  current_lesson_id: number | null;
}

export interface ExerciseItem {
  id: number;
  lesson_id: number;
  order: number;
  exercise_type: "multiple_choice" | "translate" | "match_pairs" | "fill_in_the_blank" | "type_the_answer";
  prompt: string;
  question_text?: string | null;
  audio_text?: string | null;
  options?: any;
  correct_answer?: any;
  context_sentence?: string | null;
  hints?: Record<string, string> | null;
}

export interface LessonDetail {
  id: number;
  title: string;
  skill_id: number;
  order: number;
  xp_reward: number;
  hearts: number;
  exercises: ExerciseItem[];
}

export interface AchievementItem {
  id: number;
  badge_key: string;
  title: string;
  description: string;
  icon: string;
  current_level: number;
  max_level: number;
  current_progress: number;
  target_progress: number;
  unlocked: boolean;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  name: string;
  avatar: string;
  xp: number;
  league: string;
  is_current_user: boolean;
}

export interface LeaderboardData {
  league_name: string;
  days_left: number;
  users: LeaderboardUser[];
}

export async function fetchUser(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/me`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchCoursePath(): Promise<CoursePathResponse> {
  const res = await fetch(`${API_BASE}/api/courses/path`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch course path");
  return res.json();
}

export async function fetchLesson(lessonId: number): Promise<LessonDetail> {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch lesson");
  return res.json();
}

export async function submitAnswer(exerciseId: number, answer: any) {
  const res = await fetch(`${API_BASE}/api/lessons/submit-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exercise_id: exerciseId, answer }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function completeLesson(lessonId: number, score: number = 100, heartsLost: number = 0) {
  const res = await fetch(`${API_BASE}/api/lessons/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_id: lessonId, score, hearts_lost: heartsLost }),
  });
  if (!res.ok) throw new Error("Failed to complete lesson");
  return res.json();
}

export async function refillHearts(action: "refill" | "practice" | "reset") {
  const res = await fetch(`${API_BASE}/api/users/hearts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to update hearts");
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardData> {
  const res = await fetch(`${API_BASE}/api/leaderboard`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export async function fetchAchievements(): Promise<AchievementItem[]> {
  const res = await fetch(`${API_BASE}/api/users/achievements`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch achievements");
  return res.json();
}

export async function simulateStreak(action: "advance_day" | "skip_day" | "reset") {
  const res = await fetch(`${API_BASE}/api/users/simulate-streak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to simulate streak");
  return res.json();
}

export async function updateDailyGoal(goal: number) {
  const res = await fetch(`${API_BASE}/api/users/daily-goal?goal=${goal}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update daily goal");
  return res.json();
}

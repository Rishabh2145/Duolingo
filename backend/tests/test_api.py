import os
import sys
import unittest

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from database import init_db, get_db_connection
from seed import seed_database
from routers.courses import get_course_path
from routers.lessons import get_lesson, submit_answer, complete_lesson
from routers.users import get_current_user, handle_hearts, simulate_streak, update_daily_goal
from routers.leaderboard import get_leaderboard
from schemas import (
    SubmitAnswerRequest, CompleteLessonRequest,
    HeartActionRequest, SimulateStreakRequest
)


class TestDuolingoBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        seed_database()

    def setUp(self):
        self.conn = get_db_connection()

    def tearDown(self):
        self.conn.close()

    def test_01_user_and_course_path(self):
        user = get_current_user(self.conn)
        self.assertEqual(user["username"], "alex_learner")
        self.assertGreaterEqual(user["hearts"], 1)

        path = get_course_path(self.conn)
        self.assertEqual(path["language"]["code"], "es")
        self.assertGreaterEqual(len(path["units"]), 1)
        skills = path["units"][0]["skills"]
        self.assertGreaterEqual(len(skills), 2)
        # Verify first skill is available / current
        self.assertIn(skills[0]["state"], ["current", "completed"])

    def test_02_lesson_exercises(self):
        lesson = get_lesson(1, self.conn)
        self.assertEqual(lesson["id"], 1)
        self.assertGreaterEqual(len(lesson["exercises"]), 5)

        exercise_types = [ex["exercise_type"] for ex in lesson["exercises"]]
        self.assertIn("multiple_choice", exercise_types)
        self.assertIn("translate", exercise_types)
        self.assertIn("match_pairs", exercise_types)
        self.assertIn("fill_in_the_blank", exercise_types)
        self.assertIn("type_the_answer", exercise_types)

    def test_03_submit_answers(self):
        # 1. Multiple choice correct
        res_mc = submit_answer(
            SubmitAnswerRequest(exercise_id=1, answer="opt1"),
            self.conn
        )
        self.assertTrue(res_mc.is_correct)
        self.assertEqual(res_mc.message, "Nicely done!")

        # 2. Translate correct
        res_tr = submit_answer(
            SubmitAnswerRequest(
                exercise_id=2,
                answer=["The", "woman", "eats", "an", "apple"]
            ),
            self.conn
        )
        self.assertTrue(res_tr.is_correct)

        # 3. Match pairs correct
        res_mp = submit_answer(
            SubmitAnswerRequest(
                exercise_id=3,
                answer={
                    "el hombre": "the man",
                    "la mujer": "the woman",
                    "el agua": "the water",
                    "el pan": "the bread"
                }
            ),
            self.conn
        )
        self.assertTrue(res_mp.is_correct)

        # 4. Fill in the blank correct
        res_fib = submit_answer(
            SubmitAnswerRequest(exercise_id=4, answer="bebo"),
            self.conn
        )
        self.assertTrue(res_fib.is_correct)

        # 5. Type the answer correct (tests accent normalization without accents)
        res_type = submit_answer(
            SubmitAnswerRequest(exercise_id=5, answer="la nina"),
            self.conn
        )
        self.assertTrue(res_type.is_correct)

    def test_04_wrong_answer_deducts_heart(self):
        # Reset hearts to 5 first
        handle_hearts(HeartActionRequest(action="reset"), self.conn)
        u_before = get_current_user(self.conn)
        init_hearts = u_before["hearts"]

        # Submit wrong answer
        res_wrong = submit_answer(
            SubmitAnswerRequest(exercise_id=1, answer="opt_wrong"),
            self.conn
        )
        self.assertFalse(res_wrong.is_correct)
        self.assertEqual(res_wrong.hearts_remaining, init_hearts - 1)

    def test_05_complete_lesson_and_gamification(self):
        u_before = get_current_user(self.conn)
        xp_before = u_before["xp"]

        comp = complete_lesson(
            CompleteLessonRequest(lesson_id=1, score=100, hearts_lost=0),
            self.conn
        )
        self.assertTrue(comp.success)
        self.assertEqual(comp.xp_earned, 15)
        self.assertEqual(comp.new_total_xp, xp_before + 15)
        self.assertGreaterEqual(comp.streak, 1)

    def test_06_hearts_refill_and_practice(self):
        # Reset gems to ensure refill has enough funds
        cursor = self.conn.cursor()
        cursor.execute("UPDATE users SET gems = 1000 WHERE id = 1")
        self.conn.commit()

        # Practice earns +1 heart
        # First set hearts to 3 by failing twice
        submit_answer(SubmitAnswerRequest(exercise_id=1, answer="wrong1"), self.conn)
        submit_answer(SubmitAnswerRequest(exercise_id=1, answer="wrong2"), self.conn)

        h_prac = handle_hearts(HeartActionRequest(action="practice"), self.conn)
        self.assertTrue(h_prac.success)

        # Full refill with gems
        h_refill = handle_hearts(HeartActionRequest(action="refill"), self.conn)
        self.assertTrue(h_refill.success)
        self.assertEqual(h_refill.hearts, 5)

    def test_07_streak_simulator(self):
        sim = simulate_streak(SimulateStreakRequest(action="advance_day"), self.conn)
        self.assertTrue(sim["success"])
        self.assertIn("Simulated new day", sim["message"])

    def test_08_leaderboard(self):
        lb = get_leaderboard(self.conn)
        self.assertEqual(lb["league_name"], "Silver League")
        self.assertGreaterEqual(len(lb["users"]), 5)
        # Check current user is in leaderboard
        self.assertTrue(any(u["is_current_user"] for u in lb["users"]))


if __name__ == "__main__":
    unittest.main()

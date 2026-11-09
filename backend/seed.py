import json
import datetime
from database import init_db, get_db_connection


def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) as count FROM languages")
    row = cursor.fetchone()
    if row and row["count"] > 0:
        print("Database already seeded. Skipping seed.")
        conn.close()
        return

    print("Seeding SQLite database with rich course data...")

    # 1. Insert Language (Spanish)
    cursor.execute(
        """
        INSERT INTO languages (id, code, name, flag, total_learners)
        VALUES (1, 'es', 'Spanish', '🇪🇸', 15800000)
        """
    )

    # 2. Insert Default Learner (Alex Rivera)
    today = datetime.date.today().isoformat()
    cursor.execute(
        """
        INSERT INTO users (
            id, username, name, email, avatar, streak, max_streak,
            xp, gems, hearts, max_hearts, daily_xp_goal, today_xp,
            last_active_date, active_language_id
        ) VALUES (
            1, 'alex_learner', 'Alex Rivera', 'alex@example.com',
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            4, 7, 345, 650, 5, 5, 30, 15, ?, 1
        )
        """,
        (today,)
    )

    # 3. Insert Units
    units = [
        (1, 1, 1, "Unit 1", "Introduce yourself, order food, and greet friends", "#58cc02"),
        (2, 1, 2, "Unit 2", "Describe family, routines, and count to 100", "#ce82ff"),
        (3, 1, 3, "Unit 3", "Ask for directions, shop in markets, and explore cities", "#00cd9c"),
    ]
    cursor.executemany(
        """
        INSERT INTO units (id, language_id, "order", title, description, color)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        units
    )

    # 4. Insert Skills
    skills = [
        # Unit 1
        (1, 1, 1, "Basics 1", "book", 1),
        (2, 1, 2, "Greetings", "chat", 1),
        (3, 1, 3, "Café & Food", "coffee", 1),
        # Unit 2
        (4, 2, 1, "Family", "star", 1),
        (5, 2, 2, "Daily Life", "trophy", 1),
        # Unit 3
        (6, 3, 1, "Travel", "apple", 1),
    ]
    cursor.executemany(
        """
        INSERT INTO skills (id, unit_id, "order", title, icon, crowns_required)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        skills
    )

    # 5. Insert Lessons
    lessons = [
        # Skill 1 (Basics 1)
        (1, 1, 1, "The Fundamentals", 15),
        (2, 1, 2, "Everyday Words", 15),
        # Skill 2 (Greetings)
        (3, 2, 1, "Saying Hello", 15),
        (4, 2, 2, "Polite Expressions", 15),
        # Skill 3 (Café & Food)
        (5, 3, 1, "Ordering Coffee", 15),
        (6, 3, 2, "At the Bakery", 15),
        # Unit 2 Skills
        (7, 4, 1, "My Family", 20),
        (8, 5, 1, "Morning Routine", 20),
        # Unit 3 Skill
        (9, 6, 1, "Airport Check-in", 20),
    ]
    cursor.executemany(
        """
        INSERT INTO lessons (id, skill_id, "order", title, xp_reward)
        VALUES (?, ?, ?, ?, ?)
        """,
        lessons
    )

    # 6. Pre-mark Lesson 1 as completed for existing learner progress
    yesterday_dt = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)).isoformat()
    cursor.execute(
        """
        INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, score)
        VALUES (1, 1, 1, ?, 100)
        """,
        (yesterday_dt,)
    )

    # 7. Insert Exercises for Lessons
    exercises = [
        # --- Lesson 1: Basics 1 - The Fundamentals ---
        # 1. Multiple Choice
        (
            1, 1, 1, "multiple_choice",
            'Which one of these is "the boy"?',
            None,
            "El niño",
            json.dumps([
                {"id": "opt1", "text": "el niño", "emoji": "👦"},
                {"id": "opt2", "text": "la niña", "emoji": "👧"},
                {"id": "opt3", "text": "la manzana", "emoji": "🍎"}
            ]),
            json.dumps("opt1"),
            None,
            json.dumps({"niño": "boy", "el": "the"})
        ),
        # 2. Translate (Word Bank)
        (
            2, 1, 2, "translate",
            "Translate this sentence",
            "La mujer come una manzana",
            "La mujer come una manzana",
            json.dumps(["The", "woman", "eats", "an", "apple", "boy", "drinks", "water", "bread"]),
            json.dumps(["The", "woman", "eats", "an", "apple"]),
            None,
            json.dumps({"mujer": "woman", "come": "eats", "manzana": "apple"})
        ),
        # 3. Match Pairs
        (
            3, 1, 3, "match_pairs",
            "Tap the matching pairs",
            None,
            None,
            json.dumps([
                {"id": "p1", "source": "el hombre", "target": "the man"},
                {"id": "p2", "source": "la mujer", "target": "the woman"},
                {"id": "p3", "source": "el agua", "target": "the water"},
                {"id": "p4", "source": "el pan", "target": "the bread"}
            ]),
            json.dumps({
                "el hombre": "the man",
                "la mujer": "the woman",
                "el agua": "the water",
                "el pan": "the bread"
            }),
            None,
            None
        ),
        # 4. Fill in the blank
        (
            4, 1, 4, "fill_in_the_blank",
            "Complete the sentence",
            "Yo ___ agua todos los días.",
            "Yo bebo agua",
            json.dumps(["bebo", "bebes", "bebe", "comemos"]),
            json.dumps("bebo"),
            "Yo [blank] agua todos los días.",
            json.dumps({"bebo": "I drink", "agua": "water"})
        ),
        # 5. Type the answer
        (
            5, 1, 5, "type_the_answer",
            "Write this in Spanish",
            "The girl",
            "La niña",
            None,
            json.dumps(["la niña", "la nina"]),
            None,
            json.dumps({"girl": "niña"})
        ),

        # --- Lesson 2: Basics 1 - Everyday Words ---
        (
            6, 2, 1, "multiple_choice",
            'Select the correct translation for "the bread"',
            None,
            "El pan",
            json.dumps([
                {"id": "opt1", "text": "la leche", "emoji": "🥛"},
                {"id": "opt2", "text": "el pan", "emoji": "🍞"},
                {"id": "opt3", "text": "el agua", "emoji": "💧"}
            ]),
            json.dumps("opt2"),
            None,
            json.dumps({"pan": "bread"})
        ),
        (
            7, 2, 2, "translate",
            "Translate this sentence",
            "Él bebe leche",
            "Él bebe leche",
            json.dumps(["He", "drinks", "milk", "She", "eats", "water", "an", "apple"]),
            json.dumps(["He", "drinks", "milk"]),
            None,
            json.dumps({"él": "he", "bebe": "drinks", "leche": "milk"})
        ),
        (
            8, 2, 3, "match_pairs",
            "Tap the matching pairs",
            None,
            None,
            json.dumps([
                {"id": "p1", "source": "leche", "target": "milk"},
                {"id": "p2", "source": "manzana", "target": "apple"},
                {"id": "p3", "source": "bebe", "target": "drinks"},
                {"id": "p4", "source": "come", "target": "eats"}
            ]),
            json.dumps({
                "leche": "milk",
                "manzana": "apple",
                "bebe": "drinks",
                "come": "eats"
            }),
            None,
            None
        ),
        (
            9, 2, 4, "fill_in_the_blank",
            "Fill in the blank",
            "Tú ___ una manzana.",
            "Tú comes una manzana",
            json.dumps(["comes", "como", "come"]),
            json.dumps("comes"),
            "Tú [blank] una manzana.",
            json.dumps({"comes": "you eat"})
        ),
        (
            10, 2, 5, "type_the_answer",
            "Write in Spanish: 'I am a man'",
            "I am a man",
            "Yo soy un hombre",
            None,
            json.dumps(["yo soy un hombre", "soy un hombre"]),
            None,
            json.dumps({"I am": "yo soy", "man": "hombre"})
        ),

        # --- Lesson 3: Greetings - Saying Hello ---
        (
            11, 3, 1, "multiple_choice",
            'How do you say "Good morning"?',
            None,
            "Buenos días",
            json.dumps([
                {"id": "opt1", "text": "Buenos días", "emoji": "🌅"},
                {"id": "opt2", "text": "Buenas noches", "emoji": "🌙"},
                {"id": "opt3", "text": "Mucho gusto", "emoji": "🤝"}
            ]),
            json.dumps("opt1"),
            None,
            json.dumps({"buenos": "good", "días": "days/morning"})
        ),
        (
            12, 3, 2, "translate",
            "Translate this sentence",
            "Hola, ¿cómo estás?",
            "Hola, ¿cómo estás?",
            json.dumps(["Hello", "how", "are", "you", "Goodbye", "thank", "good", "morning"]),
            json.dumps(["Hello", "how", "are", "you"]),
            None,
            json.dumps({"hola": "hello", "cómo estás": "how are you"})
        ),
        (
            13, 3, 3, "match_pairs",
            "Tap the matching pairs",
            None,
            None,
            json.dumps([
                {"id": "p1", "source": "hola", "target": "hello"},
                {"id": "p2", "source": "adiós", "target": "goodbye"},
                {"id": "p3", "source": "gracias", "target": "thank you"},
                {"id": "p4", "source": "por favor", "target": "please"}
            ]),
            json.dumps({
                "hola": "hello",
                "adiós": "goodbye",
                "gracias": "thank you",
                "por favor": "please"
            }),
            None,
            None
        ),
        (
            14, 3, 4, "fill_in_the_blank",
            "Select the missing word",
            "Muchas ___ por tu ayuda.",
            "Muchas gracias por tu ayuda",
            json.dumps(["gracias", "de nada", "por favor"]),
            json.dumps("gracias"),
            "Muchas [blank] por tu ayuda.",
            json.dumps({"muchas gracias": "thank you very much"})
        ),
        (
            15, 3, 5, "type_the_answer",
            "Write in Spanish: 'Goodbye, see you tomorrow'",
            "Goodbye, see you tomorrow",
            "Adiós, hasta mañana",
            None,
            json.dumps(["adiós, hasta mañana", "adios hasta manana", "adios, hasta manana", "hasta mañana"]),
            None,
            json.dumps({"goodbye": "adiós", "see you tomorrow": "hasta mañana"})
        ),

        # --- Lesson 5: Café & Food - Ordering Coffee ---
        (
            16, 5, 1, "translate",
            "Translate this sentence",
            "Un café con leche, por favor",
            "Un café con leche, por favor",
            json.dumps(["A", "coffee", "with", "milk", "please", "tea", "sugar", "water", "sandwich"]),
            json.dumps(["A", "coffee", "with", "milk", "please"]),
            None,
            json.dumps({"café": "coffee", "con": "with", "leche": "milk"})
        ),
        (
            17, 5, 2, "match_pairs",
            "Tap the matching pairs",
            None,
            None,
            json.dumps([
                {"id": "p1", "source": "el café", "target": "the coffee"},
                {"id": "p2", "source": "el té", "target": "the tea"},
                {"id": "p3", "source": "el azúcar", "target": "the sugar"},
                {"id": "p4", "source": "la cuenta", "target": "the bill"}
            ]),
            json.dumps({
                "el café": "the coffee",
                "el té": "the tea",
                "el azúcar": "the sugar",
                "la cuenta": "the bill"
            }),
            None,
            None
        ),
        (
            18, 5, 3, "type_the_answer",
            "Write in Spanish: 'A table for two'",
            "A table for two",
            "Una mesa para dos",
            None,
            json.dumps(["una mesa para dos", "mesa para dos"]),
            None,
            json.dumps({"table": "mesa", "for two": "para dos"})
        ),
    ]

    cursor.executemany(
        """
        INSERT INTO exercises (
            id, lesson_id, "order", exercise_type, prompt, question_text,
            audio_text, options_json, correct_answer_json, context_sentence, hints_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        exercises
    )

    # 8. User Achievements
    achievements = [
        (1, 1, "wildfire", "Wildfire", "Reach a 3 day streak", "flame", 1, 5, 4, 3, 1),
        (2, 1, "sage", "Sage", "Earn 500 total XP", "book-open", 1, 5, 345, 500, 0),
        (3, 1, "scholar", "Scholar", "Learn 50 new words in a single course", "graduation-cap", 1, 3, 32, 50, 0),
        (4, 1, "sharpshooter", "Sharpshooter", "Complete 5 lessons without making mistakes", "target", 1, 5, 3, 5, 0),
        (5, 1, "champion", "Champion", "Advance to the Gold League", "trophy", 1, 1, 0, 1, 0),
    ]
    cursor.executemany(
        """
        INSERT INTO user_achievements (
            id, user_id, badge_key, title, description, icon,
            current_level, max_level, current_progress, target_progress, unlocked
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        achievements
    )

    # 9. Leaderboard Entries
    leaderboard_data = [
        (1, "sofia_polyglot", "Sofia Chen", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", 520, "Silver League", 0),
        (2, "diego_madrid", "Diego Ramos", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", 485, "Silver League", 0),
        (3, "emma_linguist", "Emma Watson", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", 410, "Silver League", 0),
        (4, "alex_learner", "Alex Rivera (You)", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", 345, "Silver League", 1),
        (5, "lucas_explorer", "Lucas Silva", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", 310, "Silver League", 0),
        (6, "maria_s", "Maria Santos", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", 260, "Silver League", 0),
        (7, "kenji_t", "Kenji Takahashi", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80", 210, "Silver League", 0),
        (8, "clara_berlin", "Clara Müller", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", 180, "Silver League", 0),
        (9, "zack_nyc", "Zack Miller", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80", 140, "Silver League", 0),
        (10, "hannah_k", "Hannah Kim", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", 95, "Silver League", 0),
    ]
    cursor.executemany(
        """
        INSERT INTO leaderboard (id, username, name, avatar, xp, league, is_current_user)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        leaderboard_data
    )

    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    seed_database()

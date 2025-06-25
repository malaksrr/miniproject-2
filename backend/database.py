# backend/database.py
import sqlite3
import os

DB_PATH = "study_habits.db"

def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS study_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                study_hours REAL NOT NULL,
                sleep_hours REAL NOT NULL,
                break_frequency INTEGER NOT NULL,
                concentration_level INTEGER NOT NULL,
                burnout_risk BOOLEAN,
                risk_probability REAL
            )
        ''')
        conn.commit()
        conn.close()
        print("✅ Database initialized and table created.")
    else:
        print("✅ Database already exists.")

def save_study_session(data):
    """
    Save a study session into the database.
    data should be a dict containing keys:
    study_hours, sleep_hours, break_frequency, concentration_level, burnout_risk, risk_probability
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO study_sessions (
            study_hours, sleep_hours, break_frequency, concentration_level,
            burnout_risk, risk_probability
        ) VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['study_hours'],
        data['sleep_hours'],
        data['break_frequency'],
        data['concentration_level'],
        data['burnout_risk'],
        data['risk_probability']
    ))

    conn.commit()
    conn.close()

def get_all_sessions():
    """Retrieve all stored study sessions."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dicts
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM study_sessions ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
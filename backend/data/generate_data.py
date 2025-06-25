# backend/data/generate_data.py
import pandas as pd
import random

def generate_data(num_samples=1000):
    data = []
    for _ in range(num_samples):
        study_hours = round(random.uniform(2, 14), 1)
        sleep_hours = round(random.uniform(4, 10), 1)
        break_frequency = random.randint(10, 60)
        concentration_level = random.randint(1, 5)

        # Heuristic-based burnout risk
        risk_score = (
            study_hours > 10 or
            sleep_hours < 6 or
            break_frequency < 20 or
            concentration_level < 3
        )

        burnout_risk = 1 if risk_score else 0

        data.append([
            study_hours,
            sleep_hours,
            break_frequency,
            concentration_level,
            burnout_risk
        ])

    df = pd.DataFrame(data, columns=[
        'study_hours', 'sleep_hours', 'break_frequency',
        'concentration_level', 'burnout_risk'
    ])
    df.to_csv(r'C:\Users\HP\Desktop\miniprojeee\SHHT\backend/data/burnout_data.csv', index=False)

if __name__ == '__main__':
    generate_data()
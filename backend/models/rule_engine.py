# models/rule_engine.py

def analyze_study_session(data):
    """
    Analyze study session using rule-based logic.
    Input: JSON object with keys like 'study_hours', 'sleep_hours', etc.
    Output: Recommendations based on rules.
    """
    recommendations = []
    warnings = []

    if data.get('study_hours', 0) > 8:
        warnings.append("You've studied more than 8 hours today.")
        recommendations.append("Try taking more breaks or reduce daily study time.")

    if data.get('break_frequency', 60) < 25:
        recommendations.append("Use the Pomodoro technique: 25 minutes of study followed by a 5-minute break.")

    if data.get('sleep_hours', 0) < 6:
        warnings.append("You're not getting enough sleep.")
        recommendations.append("Aim for at least 7–8 hours of sleep per night.")

    if data.get('concentration_level', 5) < 3:
        recommendations.append("Consider changing your environment or studying lighter topics now.")

    return {
        "warnings": warnings,
        "recommendations": recommendations
    }
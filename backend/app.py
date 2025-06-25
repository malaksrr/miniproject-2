from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from models import rule_engine
from models.burnout_model import predict_burnout
from database import save_study_session

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Rule-based analysis
        rule_result = rule_engine.analyze_study_session(data)

        # ML-based prediction
        try:
            ml_result = predict_burnout(data)
        except Exception as e:
            ml_result = {
                "burnout_risk": False,
                "risk_probability": 0.0,
                "error": str(e)
            }

        # Combine results
        combined_recommendations = list(set(
            rule_result["recommendations"]
        ))

        if ml_result.get("burnout_risk"):
            combined_recommendations.append(
                "⚠️ Machine learning detected a high risk of burnout. Consider taking a rest."
            )

        # Save session to database
        db_data = {
            "study_hours": data.get("study_hours"),
            "sleep_hours": data.get("sleep_hours"),
            "break_frequency": data.get("break_frequency"),
            "concentration_level": data.get("concentration_level"),
            "burnout_risk": ml_result.get("burnout_risk"),
            "risk_probability": ml_result.get("risk_probability")
        }
        save_study_session(db_data)

        return jsonify({
            "input_data": data,
            "rule_based_analysis": rule_result,
            "ml_based_prediction": ml_result,
            "combined_recommendations": combined_recommendations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
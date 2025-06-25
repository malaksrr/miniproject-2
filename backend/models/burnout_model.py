import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import os

MODEL_PATH = r"C:\Users\HP\Desktop\miniprojeee\SHHT\backend\burnout_predictor.pkl"

def train_burnout_model():
    """Train and save the burnout prediction model"""
    try:
        # Load data
        df = pd.read_csv(r"C:\Users\HP\Desktop\miniprojeee\SHHT\backend\data\burnout_data.csv")
        
        # Verify required columns exist
        required_cols = ['study_hours', 'sleep_hours', 'break_frequency', 'concentration_level', 'burnout_risk']
        if not all(col in df.columns for col in required_cols):
            raise ValueError("CSV is missing required columns")
            
        # Prepare features and target
        X = df[["study_hours", "sleep_hours", "break_frequency", "concentration_level"]]
        y = df["burnout_risk"]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model with balanced class weights
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=5,
            class_weight='balanced',  # Handle imbalanced data
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        print("\nModel Evaluation:")
        print(classification_report(y_test, y_pred))
        print("\nConfusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
        
        # Save model
        joblib.dump(model, MODEL_PATH)
        print(f"\nModel saved to {MODEL_PATH}")
        
        return model
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        raise

def load_burnout_model():
    """Load the pre-trained model with error handling"""
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        return joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise

def predict_burnout(input_data):
    """Make predictions with input validation"""
    try:
        model = load_burnout_model()
        
        # Validate input
        required_fields = ['study_hours', 'sleep_hours', 'break_frequency', 'concentration_level']
        if not all(field in input_data for field in required_fields):
            raise ValueError("Missing required input fields")
            
        # Prepare input
        input_df = pd.DataFrame([{
            'study_hours': float(input_data['study_hours']),
            'sleep_hours': float(input_data['sleep_hours']),
            'break_frequency': int(input_data['break_frequency']),
            'concentration_level': int(input_data['concentration_level'])
        }])
        
        # Predict
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]
        
        return {
            "burnout_risk": bool(prediction),
            "risk_probability": float(probability),
            "model_version": "1.1"  # For tracking
        }
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return {
            "error": str(e),
            "burnout_risk": None,
            "risk_probability": None
        }

if __name__ == "__main__":
    print("Training new burnout prediction model...")
    trained_model = train_burnout_model()
    
    # Test prediction
    test_data = {
        'study_hours': 12,
        'sleep_hours': 4,
        'break_frequency': 10,
        'concentration_level': 1
    }
    print("\nTest Prediction:", predict_burnout(test_data))
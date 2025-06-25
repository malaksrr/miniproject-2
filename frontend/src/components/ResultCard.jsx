import React from 'react';
import './ResultCard.css';

const ResultCard = ({ result }) => {
  if (!result) return null;

  // Calculate risk percentage and determine color
  const riskPercentage = (result.ml_based_prediction.risk_probability * 100).toFixed(1);
  const getRiskColor = () => {
    const risk = parseFloat(riskPercentage);
    if (risk > 70) return '#e53935'; // Red for high risk
    if (risk > 40) return '#fb8c00'; // Orange for medium risk
    return '#43a047'; // Green for low risk
  };

  return (
    <div className="result-card">
      <div className="card-header">
        <h3>📊 Analysis Results</h3>
      </div>

      {/* Burnout Risk Meter */}
      <div className="risk-section">
        <div className="risk-meter">
          <div 
            className="risk-progress" 
            style={{
              width: `${riskPercentage}%`,
              backgroundColor: getRiskColor()
            }}
          ></div>
        </div>
        <div className="risk-percentage" style={{ color: getRiskColor() }}>
          Burnout Risk: {riskPercentage}%
          {result.ml_based_prediction.burnout_risk && (
            <span className="risk-alert"> ⚠️ High Risk</span>
          )}
        </div>
      </div>

      {/* Warnings Section */}
      {result.rule_based_analysis.warnings.length > 0 && (
        <div className="section">
          <h4>⚠️ Warnings</h4>
          <ul>
            {result.rule_based_analysis.warnings.map((warning, index) => (
              <li key={index} className="warning-item">{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Section */}
      {result.combined_recommendations.length > 0 && (
        <div className="section">
          <h4>💡 Recommendations</h4>
          <ul>
            {result.combined_recommendations.map((recommendation, index) => (
              <li key={index} className="recommendation-item">{recommendation}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Debug Info (remove in production) */}
      <div className="debug-info">
        <small>ML Confidence: {result.ml_based_prediction.risk_probability.toFixed(4)}</small>
      </div>
    </div>
  );
};

export default ResultCard;
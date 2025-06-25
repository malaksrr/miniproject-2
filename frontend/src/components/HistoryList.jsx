import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryList.css';

const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/history?range=${timeRange}`);
        setHistory(res.data);
      } catch (err) {
        setError('Failed to load history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [timeRange]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (history.length === 0) {
    return <div className="empty-state">No study sessions recorded yet.</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Your Study History</h3>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Study</th>
              <th>Sleep</th>
              <th>Breaks</th>
              <th>Focus</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {history.map((session) => (
              <tr
                key={session.id}
                className={session.burnout_risk ? 'high-risk' : ''}
              >
                <td>{new Date(session.timestamp).toLocaleDateString()}</td>
                <td>{session.study_hours}h</td>
                <td>{session.sleep_hours}h</td>
                <td>Every {session.break_frequency}min</td>
                <td>
                  <div className="concentration-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < session.concentration_level ? 'active' : ''}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span
                    className={`risk-badge ${
                      session.burnout_risk ? 'high' : 'low'
                    }`}
                  >
                    {session.burnout_risk ? 'High' : 'Low'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
import React, { useState } from 'react';
import Header from './components/Header.jsx';
import FormInput from './components/FormInput.jsx';
import ResultCard from './components/ResultCard.jsx';
import HistoryList from './components/HistoryList.jsx';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = (data) => {
    setAnalysisResult(data);
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="input-section">
          <FormInput onAnalyze={handleAnalyze} />
        </div>
        
        {analysisResult && (
          <div id="results" className="results-section">
            <ResultCard result={analysisResult} />
          </div>
        )}

        <div className="history-section">
          <HistoryList />
        </div>
      </main>
    </div>
  );
}

export default App;
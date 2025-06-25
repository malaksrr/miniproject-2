import React, { useState } from 'react';
import axios from 'axios';
import './FormInput.css';

const FormInput = ({ onAnalyze }) => {
  const [formData, setFormData] = useState({
    study_hours: '',
    sleep_hours: '',
    break_frequency: '',
    concentration_level: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    const payload = {
      study_hours: Number(formData.study_hours),
      sleep_hours: Number(formData.sleep_hours),
      break_frequency: Number(formData.break_frequency),
      concentration_level: Number(formData.concentration_level)
    };

    // Study Hours Validation
    if (!formData.study_hours || isNaN(payload.study_hours)) {
      newErrors.study_hours = 'Please enter valid study hours';
    } else if (payload.study_hours < 0.1 || payload.study_hours > 24) {
      newErrors.study_hours = 'Must be between 0.1-24 hours';
    }

    // Sleep Hours Validation
    if (!formData.sleep_hours || isNaN(payload.sleep_hours)) {
      newErrors.sleep_hours = 'Please enter valid sleep hours';
    } else if (payload.sleep_hours < 0 || payload.sleep_hours > 24) {
      newErrors.sleep_hours = 'Must be between 0-24 hours';
    }

    // Break Frequency Validation
    if (!formData.break_frequency || isNaN(payload.break_frequency)) {
      newErrors.break_frequency = 'Please enter valid break frequency';
    } else if (payload.break_frequency < 5 || payload.break_frequency > 120) {
      newErrors.break_frequency = 'Must be between 5-120 minutes';
    }

    // Concentration Level Validation
    if (!formData.concentration_level || isNaN(payload.concentration_level)) {
      newErrors.concentration_level = 'Please select concentration level';
    } else if (payload.concentration_level < 1 || payload.concentration_level > 5) {
      newErrors.concentration_level = 'Must be between 1-5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/analyze', {
        study_hours: Number(formData.study_hours),
        sleep_hours: Number(formData.sleep_hours),
        break_frequency: Number(formData.break_frequency),
        concentration_level: Number(formData.concentration_level)
      });
      onAnalyze(res.data);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="form-group">
        <label>Study Hours (per day)</label>
        <input
          type="number"
          name="study_hours"
          min="0.1"
          max="24"
          step="0.1"
          value={formData.study_hours}
          onChange={handleChange}
          className={errors.study_hours ? 'error' : ''}
        />
        {errors.study_hours && <span className="error-message">{errors.study_hours}</span>}
      </div>

      <div className="form-group">
        <label>Sleep Hours (last night)</label>
        <input
          type="number"
          name="sleep_hours"
          min="0"
          max="24"
          step="0.1"
          value={formData.sleep_hours}
          onChange={handleChange}
          className={errors.sleep_hours ? 'error' : ''}
        />
        {errors.sleep_hours && <span className="error-message">{errors.sleep_hours}</span>}
      </div>

      <div className="form-group">
        <label>Break Frequency (minutes between breaks)</label>
        <input
          type="number"
          name="break_frequency"
          min="5"
          max="120"
          value={formData.break_frequency}
          onChange={handleChange}
          className={errors.break_frequency ? 'error' : ''}
        />
        {errors.break_frequency && <span className="error-message">{errors.break_frequency}</span>}
      </div>

      <div className="form-group">
        <label>Concentration Level (1-5)</label>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((num) => (
            <React.Fragment key={num}>
              <input
                type="radio"
                id={`concentration-${num}`}
                name="concentration_level"
                value={num}
                checked={parseInt(formData.concentration_level) === num}
                onChange={handleChange}
              />
              <label htmlFor={`concentration-${num}`}>{num}</label>
            </React.Fragment>
          ))}
        </div>
        {errors.concentration_level && <span className="error-message">{errors.concentration_level}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Analyzing...
          </>
        ) : (
          'Analyze My Habits'
        )}
      </button>
    </form>
  );
};

export default FormInput;
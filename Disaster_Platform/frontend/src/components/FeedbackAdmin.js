import React, { useState } from 'react';
import '../styles/FeedbackAdmin.css';

const FeedbackModal = ({ show, onClose, onSubmit, volunteer, task, isSubmitting }) => {
  const [rating, setRating] = useState(4); // Default to highest rating (4)
  const [comments, setComments] = useState('');

  // Handle rating change
  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  // Handle comments change
  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comments });
  };

  // Get rating label based on selected rating
  const getRatingLabel = () => {
    switch(rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Excellent';
      default: return '';
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h3>Provide Task Feedback</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="feedback-modal-body">
          <div className="volunteer-info">
            <p><strong>Volunteer:</strong> {volunteer?.name}</p>
            <p><strong>Task:</strong> {task?.taskType}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group rating-form-group">
              <label>Rate the volunteer's performance:</label>
              <div className="rating-container">
                {[1, 2, 3, 4].map((value) => (
                  <div key={value} className="rating-item">
                    <input
                      type="radio"
                      id={`rating-${value}`}
                      name="rating"
                      value={value}
                      checked={rating === value}
                      onChange={handleRatingChange}
                    />
                    <label htmlFor={`rating-${value}`}>{value}</label>
                  </div>
                ))}
              </div>
              <div className="rating-feedback">
                <span className="rating-label">{getRatingLabel()}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="comments">Additional Comments:</label>
              <textarea
                id="comments"
                name="comments"
                rows="4"
                value={comments}
                onChange={handleCommentsChange}
                placeholder="Provide specific feedback about the volunteer's performance on this task..."
              ></textarea>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
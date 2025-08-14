import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../context/UserContext";
import NavBar from '../components/Navbar';
import '../styles/ViewFeedbackVolunteer.css';

const VolunteerFeedbackView = () => {
  const { user } = useUser();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAsViewed, setMarkingAsViewed] = useState(false);
  const [activeButton, setActiveButton] = useState(3); // Assuming feedback is button 3

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        if (!user || !user.id) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/feedback/volunteer/${user.id}`);
        setFeedbackList(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [user]);

  const markFeedbackAsViewed = async (feedbackId) => {
    setMarkingAsViewed(true);
    try {
      await axios.patch(`http://localhost:5000/api/feedback/${feedbackId}/view`, {
        status: 1
      });
      
      setFeedbackList(prevList => 
        prevList.map(feedback => 
          feedback._id === feedbackId ? { ...feedback, status: 1 } : feedback
        )
      );
      
    } catch (err) {
      console.error('Error marking feedback as viewed:', err);
      alert('Failed to mark feedback as viewed. Please try again.');
    } finally {
      setMarkingAsViewed(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStarRating = (rating) => {
    return (
      <div className="a1234567890123b">
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className={`a1234567890124b ${i < rating ? 'a1234567890125b' : 'a1234567890126b'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="a1234567890127b">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a1234567890128b">
        <div className="a1234567890129b">
          <h2 className="a1234567890130b">My Feedback</h2>
          
          {loading && (
            <div className="a1234567890131b">
              <div className="a1234567890132b"></div>
              <p>Loading your feedback...</p>
            </div>
          )}
          
          {error && (
            <div className="a1234567890133b">
              <svg className="a1234567890134b" viewBox="0 0 24 24">
                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              </svg>
              {error}
            </div>
          )}
          
          {!loading && !error && feedbackList.length === 0 && (
            <div className="a1234567890135b">
              <svg className="a1234567890136b" viewBox="0 0 24 24">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
              </svg>
              <p>You don't have any feedback yet.</p>
            </div>
          )}
          
          {!loading && !error && feedbackList.length > 0 && (
            <div className="a1234567890137b">
              {feedbackList.map(feedback => (
                <div 
                  key={feedback._id} 
                  className={`a1234567890138b ${feedback.status === 1 ? 'a1234567890139b' : 'a1234567890140b'}`}
                >
                  <div className="a1234567890141b">
                    <h3 className="a1234567890142b">
                      {feedback.taskId?.taskType || 'Task'}
                      {feedback.status === 0 && (
                        <span className="a1234567890143b">New</span>
                      )}
                    </h3>
                    <div className="a1234567890144b">{formatDate(feedback.createdAt)}</div>
                  </div>
                  
                  <div className="a1234567890145b">
                    <div className="a1234567890146b">
                      {renderStarRating(feedback.rating)}
                      <span className="a1234567890147b">{feedback.rating}/4</span>
                    </div>
                    
                    {feedback.comments && (
                      <div className="a1234567890148b">
                        <h4 className="a1234567890149b">Comments</h4>
                        <p className="a1234567890150b">{feedback.comments}</p>
                      </div>
                    )}
                    
                    <div className="a1234567890151b">
                      <p><strong>From:</strong> {feedback.adminId?.name || 'Administrator'}</p>
                      <p><strong>Task:</strong> {feedback.taskId?.description || 'Task description not available'}</p>
                    </div>
                    
                    {feedback.status === 0 && (
                      <button 
                        className="a1234567890152b"
                        onClick={() => markFeedbackAsViewed(feedback._id)}
                        disabled={markingAsViewed}
                      >
                        {markingAsViewed ? (
                          <>
                            <svg className="a1234567890153b" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            </svg>
                            Marking...
                          </>
                        ) : (
                          <>
                            <svg className="a1234567890154b" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            Mark as Viewed
                          </>
                        )}
                      </button>
                    )}
                    
                    {feedback.status === 1 && (
                      <div className="a1234567890155b">
                        <svg className="a1234567890156b" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Viewed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerFeedbackView;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminCompletedTaskView.css';
import { useUser } from "../context/UserContext";
import AdminSidebar from './AdminSidebar';

import FeedbackModal from './FeedbackAdmin';

const AdminCompletedTasksView = () => {
  const { user } = useUser();
  const [taskTypes, setTaskTypes] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [latestTask, setLatestTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyingTask, setVerifyingTask] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Fetch all task types on component mount
  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/list');
        setTaskTypes(response.data);
      } catch (err) {
        console.error('Error fetching task types:', err);
        setError('Failed to load task types');
      }
    };

    fetchTaskTypes();
  }, []);

  // Fetch completed tasks when a task type is selected or on initial load
  useEffect(() => {
    fetchLatestCompletedTask(selectedTaskType);
  }, [selectedTaskType]);

  // Check for existing feedback when a task is loaded
  useEffect(() => {
    if (latestTask) {
      checkExistingFeedback(latestTask._id);
    } else {
      setExistingFeedback(null);
    }
  }, [latestTask]);

  const fetchLatestCompletedTask = async (taskType) => {
    setLoading(true);
    setError('');
    try {
      // Fetch tasks with status 4 (completed)
      const response = await axios.get(`http://localhost:5000/api/tasks/completed/${taskType}`);
      
      if (response.data.length > 0) {
        // Find the task with the most recent createdAt date
        const sortedTasks = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Set only the latest task
        setLatestTask(sortedTasks[0]);
      } else {
        setLatestTask(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching completed tasks:', err);
      setLoading(false);
    }
  };

  const checkExistingFeedback = async (taskId) => {
    setFeedbackLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/feedback/task/${taskId}`);
      setExistingFeedback(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No feedback found is not an error
        setExistingFeedback(null);
      } else {
        console.error('Error checking for existing feedback:', err);
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Handle task type selection change
  const handleTaskTypeChange = (e) => {
    setSelectedTaskType(e.target.value);
  };

  // Handle verify completion button click
  const handleVerifyCompletion = async (taskId) => {
    setVerifyingTask(true);
    try {
      await axios.patch(`http://localhost:5000/api/tasks/verify-completion/${taskId}`, {
        status: 0 // Set status back to 0 (Available)
      });
      alert("✅ Completion Verified");

      // Clear the current task and fetch the next latest one
      setLatestTask(null);
      fetchLatestCompletedTask(selectedTaskType);
      
    } catch (err) {
      console.error('Error verifying task completion:', err);
      setError('Failed to verify task completion');
    } finally {
      setVerifyingTask(false);
    }
  };

  // Open feedback modal
  const handleOpenFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  // Close feedback modal
  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  // Submit feedback
  const handleSubmitFeedback = async (feedbackData) => {
    setFeedbackSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/feedback/submit', {
        taskId: latestTask._id,
        volunteerId: latestTask.volunteer?._id,
        adminId: user.id,
        rating: feedbackData.rating,
        comments: feedbackData.comments,
        status: 0 // Initial status - not viewed
      });
      
      alert("✅ Feedback submitted successfully");
      setShowFeedbackModal(false);
      setExistingFeedback(response.data.feedback);
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Render appropriate details based on task type
  const renderTaskDetails = (task) => {
    switch (task.taskType) {
      case 'Transportation and Distribution':
        return (
          <div className="a143256b67467">
            <p><strong>Shelter:</strong> {task.shelter}</p>
            <p><strong>Resource Type:</strong> {task.resourceType}</p>
            <p><strong>Delivery Date & Time:</strong> {new Date(task.deliveryDateTime).toLocaleString()}</p>
          </div>
        );
      case 'Preparing and Serving Food':
        return (
          <div className="a143256b67467">
            <p><strong>Shelter:</strong> {task.shelter}</p>
          </div>
        );
      case 'Rescue Operation Management':
      case 'Rescue Operator':
        return null; // No additional details for rescue tasks
      default:
        return null;
    }
  };

  // Render feedback information if it exists
  const renderFeedbackInfo = () => {
    if (feedbackLoading) {
      return <div className="a143256b67480 a143256b67461">Checking feedback status...</div>;
    }
    
    if (existingFeedback) {
      return (
        <div className="a143256b67480 a143256b67481">
          <p className="a143256b67482">
            <span className="a143256b67483">✓</span> 
            Feedback submitted ({existingFeedback.rating}/4)
          </p>
          {existingFeedback.status === 1 && (
            <span className="a143256b67484">Viewed by volunteer</span>
          )}
        </div>
      );
    }
    
    return null;
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return 'a143256b67462';
      case 1:
        return 'a143256b67463';
      case 2:
        return 'a143256b67464';
      case 3:
        return 'a143256b67465';
      case 4:
        return 'a143256b67466';
      default:
        return '';
    }
  };

  return (
    <div className="a143256b67456">
      <AdminSidebar />
      <main className="a143256b67457">
        <div className="a143256b67458">
          <h2 className="a143256b67459">✅ Completed Task Verification</h2>
          
          {error && <div className="alert danger">{error}</div>}
          
          <div className="a143256b67460">
            <label htmlFor="taskType">Filter by Task Type:</label>
            <select
              id="taskType"
              value={selectedTaskType}
              onChange={handleTaskTypeChange}
            >
              <option value="" disabled>Select Task Type</option>
              {taskTypes.map(type => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <div className="a143256b67461">⏳ Loading latest completed task...</div>}
          
          {!loading && !error && !latestTask && (
            <div className="a143256b67468">📭 No completed tasks found.</div>
          )}

          {!loading && latestTask && (
            <div className="a143256b67469">
              <div className="a143256b67470">
                <div className="a143256b67471">
                  <h3>{latestTask.taskType}</h3>
                  <span className={`a143256b67472 ${getStatusClass(4)}`}>
                    Completed
                  </span>
                </div>
                
                <div className="a143256b67473">
                  <div className="a143256b67474">
                    <p><strong>Description:</strong> {latestTask.description}</p>
                    <p><strong>Created:</strong> {new Date(latestTask.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="a143256b67475">
                    <h4>📍 Incident Details</h4>
                    {latestTask.incident ? (
                      <>
                        <p><strong>Location:</strong> {latestTask.incident.location}</p>
                        <p><strong>Type:</strong> {latestTask.incident.type}</p>
                        <p><strong>Severity:</strong> {latestTask.incident.severity}</p>
                      </>
                    ) : (
                      <p>No incident details available</p>
                    )}
                  </div>
                  
                  <div className="a143256b67476">
                    <h4>👤 Volunteer Details</h4>
                    {latestTask.volunteer ? (
                      <>
                        <p><strong>Name:</strong> {latestTask.volunteer.name}</p>
                        <p><strong>Email:</strong> {latestTask.volunteer.email}</p>
                        <p><strong>Phone:</strong> {latestTask.volunteer.phone}</p>
                      </>
                    ) : (
                      <p>No volunteer information available</p>
                    )}
                  </div>
                  
                  {/* Render type-specific details */}
                  {renderTaskDetails(latestTask)}
                  
                  {/* Feedback information */}
                  {renderFeedbackInfo()}
                  
                  {/* Verification section with button */}
                  <div className="a143256b67477">
                    <button 
                      className="a143256b67478"
                      onClick={() => handleVerifyCompletion(latestTask._id)}
                      disabled={verifyingTask}
                    >
                      {verifyingTask ? '⏳ Verifying...' : '✅ Verify Completion'}
                    </button>
                    
                    {/* Feedback Button - only show if no feedback exists */}
                    {!existingFeedback && latestTask.volunteer && (
                      <button 
                        className="a143256b67479"
                        onClick={handleOpenFeedbackModal}
                      >
                        📝 Provide Feedback
                      </button>
                    )}
                    
                    <p className="a143256b67485">
                      Verifying will mark this task as available for new assignments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Modal */}
          {showFeedbackModal && latestTask && (
            <FeedbackModal
              show={showFeedbackModal}
              onClose={handleCloseFeedbackModal}
              onSubmit={handleSubmitFeedback}
              volunteer={latestTask.volunteer}
              task={latestTask}
              isSubmitting={feedbackSubmitting}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCompletedTasksView;
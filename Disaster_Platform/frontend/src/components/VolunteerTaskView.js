import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import '../styles/VolunteerTaskView.css';

const VolunteerTaskView = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [latestTask, setLatestTask] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeButton, setActiveButton] = useState(2); // Assuming this is the third tab in navbar

  useEffect(() => {
    const fetchVolunteerData = async () => {
      if (!user || !user.id) {
        console.error("User ID missing. Please log in again.");
        navigate('/login');
        return;
      }

      try {
        // Get volunteer info using user ID
        const volunteerRes = await axios.get(`http://localhost:5000/api/tasks/user/${user.id}`);
        const volunteerData = volunteerRes.data;

        if (!volunteerData || !volunteerData._id) {
          setError("Volunteer profile not found.");
          setLoading(false);
          return;
        }

        setVolunteer(volunteerData);

        // Fetch assigned tasks
        const tasksRes = await axios.get(`http://localhost:5000/api/tasks/volunteer/${volunteerData._id}`);
        
        // For each task, fetch the volunteer's status for that task
        const tasksWithStatus = await Promise.all(tasksRes.data.map(async (task) => {
          try {
            const statusRes = await axios.get(`http://localhost:5000/api/tasks/status/${volunteerData._id}/${task._id}`);
            return { ...task, taskStatus: statusRes.data.taskStatus };
          } catch (err) {
            console.error(`Error fetching status for task ${task._id}:`, err);
            return { ...task, taskStatus: 1 }; // Default to pending (1) if error
          }
        }));

        // Sort tasks by createdAt date (newest first)
        const sortedTasks = tasksWithStatus.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Find the first pending task (status 1) that needs action
        const pendingTask = sortedTasks.find(task => task.taskStatus === 1);
        
        // If no pending task, just get the most recent task of any status
        const mostRecentTask = pendingTask || (sortedTasks.length > 0 ? sortedTasks[0] : null);
        
        setLatestTask(mostRecentTask);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, [user, navigate]);

  const handleTaskAction = async (taskId, status) => {
    if (!volunteer || !volunteer._id) {
      console.error("Volunteer ID is missing.");
      return;
    }
  
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/tasks/update-status/${volunteer._id}/${taskId}`, { status });
      
      // Update task status locally
      setLatestTask(prev => prev ? { ...prev, taskStatus: status } : null);
      
      alert(status === 2 ? "Task accepted successfully!" : "Task rejected.");
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openMap = (latitude, longitude, label) => {
    // Open Google Maps with the given coordinates
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&label=${label}`, '_blank');
  };

  const renderTaskDetails = (task) => {
    switch (task.taskType) {
      case 'Transportation and Distribution':
        return (
          <div className="a123456b7890123">
            <div className="a123456b7890124">
              <p><strong>Shelter:</strong> {task.shelter}</p>
              {task.shelterLatitude && task.shelterLongitude && (
                <button 
                  className="a123456b7890125"
                  onClick={() => openMap(task.shelterLatitude, task.shelterLongitude, 'Shelter')}
                >
                  <svg className="a123456b7890126" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  View Shelter Map
                </button>
              )}
            </div>
            <div className="a123456b7890127">
              <div className="a123456b7890128">
                <svg className="a123456b7890129" viewBox="0 0 24 24">
                  <path d="M20 3H4c-1.1 0-1.99.9-1.99 2L2 15c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h2v2h-2V6zm0 3h2v2h-2V9zm-3-3h2v2H8V6zm0 3h2v2H8V9zm-1 2H5V9h2v2zm0-3H5V6h2v2zm9 7H8v-2h8v2zm0-4h-2V9h2v2zm0-3h-2V6h2v2zm3 3h-2V9h2v2zm0-3h-2V6h2v2z"/>
                </svg>
                <p><strong>Resource Type:</strong> {task.resourceType}</p>
              </div>
              <div className="a123456b7890128">
                <svg className="a123456b7890129" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <p><strong>Delivery Date & Time:</strong> {new Date(task.deliveryDateTime).toLocaleString()}</p>
              </div>
            </div>
          </div>
        );
      case 'Preparing and Serving Food':
        return (
          <div className="a123456b7890123">
            <div className="a123456b7890124">
              <p><strong>Shelter:</strong> {task.shelter}</p>
              {task.shelterLatitude && task.shelterLongitude && (
                <button 
                  className="a123456b7890125"
                  onClick={() => openMap(task.shelterLatitude, task.shelterLongitude, 'Shelter')}
                >
                  <svg className="a123456b7890126" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  View Shelter Map
                </button>
              )}
            </div>
          </div>
        );
      case 'Resource Distribution':
        return (
          <div className="a123456b7890123">
            <div className="a123456b7890124">
              <p><strong>Shelter:</strong> {task.shelter}</p>
              {task.shelterLatitude && task.shelterLongitude && (
                <button 
                  className="a123456b7890125"
                  onClick={() => openMap(task.shelterLatitude, task.shelterLongitude, 'Shelter')}
                >
                  <svg className="a123456b7890126" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  View Shelter Map
                </button>
              )}
            </div>
          </div>
        );
      case 'Rescue Operation Management':
      case 'Rescue Operator':
        return null;
      default:
        return null;
    }
  };

  const renderTaskStatus = (task) => {
    const taskStatus = typeof volunteer.taskStatus === 'number' ? volunteer.taskStatus : 1;
    
    switch (taskStatus) {
      case 0:
        return <div className="a123456b7890130">Wait For The New Task</div>;

      case 1:
        return (
          <div className="a123456b7890131">
            <button 
              className="a123456b7890132"
              onClick={() => handleTaskAction(task._id, 2)}
              disabled={loading}
            >
              <svg className="a123456b7890133" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              Accept Task
            </button>
            <button 
              className="a123456b7890134"
              onClick={() => handleTaskAction(task._id, 3)}
              disabled={loading}
            >
              <svg className="a123456b7890135" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
              </svg>
              Reject Task
            </button>
          </div>
        );
      case 2:
        return (
          <div className="a123456b7890136">
            <svg className="a123456b7890137" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Task is accepted
          </div>
        );
      case 3:
        return (
          <div className="a123456b7890138">
            <svg className="a123456b7890139" viewBox="0 0 24 24">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
            </svg>
            Task is rejected
          </div>
        );
      case 4:
        return (
          <div className="a123456b7890140">
            <svg className="a123456b7890141" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Task is completed
          </div>
        );
      default:
        return <div className="a123456b7890142">Unknown status</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="a123456b7890143">
        <div className="a123456b7890144"></div>
        <p>Loading your task...</p>
      </div>
    );
  }

  return (
    <div className="a123456b7890145">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a123456b7890146">
        <div className="a123456b7890147">
          <h2 className="a123456b7890148">
            <span className="a123456b7890149">My Assigned</span>
            <span className="a123456b7890150">Tasks</span>
          </h2>

          {error && (
            <div className="a123456b7890151">
              <svg className="a123456b7890152" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>{error}</p>
            </div>
          )}

          {!error && !latestTask ? (
            <div className="a123456b7890153">
              <svg className="a123456b7890154" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <h3 className="a123456b7890155">No Tasks Assigned</h3>
              <p className="a123456b7890156">You don't have any assigned tasks at the moment. Check back later!</p>
            </div>
          ) : !error && (
            <div className="a123456b7890157">
              <div className="a123456b7890158">
                <div className="a123456b7890159">
                  <div className="a123456b7890160">
                    <svg className="a123456b7890161" viewBox="0 0 24 24">
                      {latestTask.taskType === 'Transportation and Distribution' && (
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2.5-6H3V6h5.5v6.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      )}
                      {latestTask.taskType === 'Preparing and Serving Food' && (
                        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                      )}
                      {latestTask.taskType === 'Resource Distribution' && (
                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
                      )}
                      {latestTask.taskType === 'Rescue Operation Management' && (
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      )}
                      {latestTask.taskType === 'Rescue Operator' && (
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                      )}
                    </svg>
                    <h3>{latestTask.taskType}</h3>
                  </div>
                  <span className="a123456b7890162">{new Date(latestTask.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="a123456b7890163">
                  <p>{latestTask.description}</p>
                </div>

                <div className="a123456b7890164">
                  <div className="a123456b7890165">
                    <h4>
                      <svg className="a123456b7890166" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                      </svg>
                      Incident Details
                    </h4>
                    {latestTask.incident && latestTask.incident.latitude && latestTask.incident.longitude && (
                      <button 
                        className="a123456b7890125"
                        onClick={() => openMap(latestTask.incident.latitude, latestTask.incident.longitude, 'Incident')}
                      >
                        <svg className="a123456b7890126" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        View Incident Map
                      </button>
                    )}
                  </div>
                  {latestTask.incident ? (
                    <div className="a123456b7890167">
                      <div className="a123456b7890168">
                        <svg className="a123456b7890169" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <p><strong>Location:</strong> {latestTask.incident.location}</p>
                      </div>
                      <div className="a123456b7890168">
                        <svg className="a123456b7890169" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                        <p><strong>Type:</strong> {latestTask.incident.type}</p>
                      </div>
                      <div className="a123456b7890168">
                        <svg className="a123456b7890169" viewBox="0 0 24 24">
                          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                        </svg>
                        <p><strong>Severity:</strong> {latestTask.incident.severity}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="a123456b7890170">No incident details available</p>
                  )}
                </div>

                {renderTaskDetails(latestTask)}
                <div className="a123456b7890171">
                  {renderTaskStatus(latestTask)}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="f123o4567">
        <p className="p123r4567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerTaskView;
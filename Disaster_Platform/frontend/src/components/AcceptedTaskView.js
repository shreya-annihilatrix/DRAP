import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import '../styles/AcceptedTaskView.css';

const AcceptedTasksView = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [latestTask, setLatestTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeButton, setActiveButton] = useState(2); // Assuming accepted tasks is button 2

  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      if (!user || !user.id) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // Fetch tasks for the logged-in volunteer
        const response = await axios.get(`http://localhost:5000/api/tasks/volunteer/${user.id}/accepted`);
        
        // Find the latest task based on createdAt or updatedAt field
        if (response.data.length > 0) {
          // Sort tasks by createdAt in descending order (newest first)
          const sortedTasks = response.data.sort((a, b) => 
            new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
          );
          
          // Set only the latest task
          setLatestTask(sortedTasks[0]);
        }
      } catch (err) {
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedTasks();
  }, [user, navigate]);

  const openMap = (latitude, longitude, label) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&label=${label}`, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const navigateToMarkProgress = (taskId) => {
    if(latestTask.taskType === 'Resource Distribution') {
      navigate(`/volunteer/progress-form?taskId=${taskId}`);
    } else { 
      navigate(`/volunteer/progress-form?taskId=${taskId}`);
    }
  };

  if (loading) {
    return (
      <div className="a1234567b890123">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a1234567b890124">
          <div className="a1234567b890125"></div>
          <p>Loading your task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="a1234567b890123">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a1234567b890126">{error}</div>
      </div>
    );
  }

  return (
    <div className="a1234567b890123">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a1234567b890127">
        <div className="a1234567b890128">
          <h2 className="a1234567b890129">Your Accepted Task</h2>

          {!latestTask ? (
            <div className="a1234567b890130">
              <svg className="a1234567b890131" viewBox="0 0 24 24">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
              </svg>
              <p>No accepted tasks at the moment.</p>
            </div>
          ) : (
            <div className="a1234567b890132">
              <div className="a1234567b890133">
                <div className="a1234567b890134">
                  <h3 className="a1234567b890135">{latestTask.taskType}</h3>
                  <span className="a1234567b890136">
                    {latestTask.updatedAt ? formatDate(latestTask.updatedAt) : ''}
                  </span>
                </div>
                
                <p className="a1234567b890137">{latestTask.description || 'Please complete this task as soon as possible.'}</p>

                <div className="a1234567b890138">
                  <div className="a1234567b890139">
                    <svg className="a1234567b890140" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <h4>Incident Details</h4>
                  </div>
                  {latestTask.incident && (
                    <div className="a1234567b890141">
                      <p><strong>Location:</strong> {latestTask.incident.location}</p>
                      <p><strong>Type:</strong> {latestTask.incident.type}</p>
                      <p><strong>Severity:</strong> {latestTask.incident.severity}</p>
                      {latestTask.incident.latitude && latestTask.incident.longitude && (
                        <button 
                          className="a1234567b890142"
                          onClick={() => openMap(latestTask.incident.latitude, latestTask.incident.longitude, 'Incident')}
                        >
                          <svg className="a1234567b890143" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          View Incident Map
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {latestTask.shelter && (
                  <div className="a1234567b890138">
                    <div className="a1234567b890139">
                      <svg className="a1234567b890140" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                      <h4>Shelter Details</h4>
                    </div>
                    <div className="a1234567b890141">
                      <p>
                        {latestTask.shelter.name || ''} {latestTask.shelter.location || ''}
                      </p>
                      {latestTask.shelter.latitude && latestTask.shelter.longitude && (
                        <button 
                          className="a1234567b890142"
                          onClick={() => openMap(latestTask.shelter.latitude, latestTask.shelter.longitude, 'Shelter')}
                        >
                          <svg className="a1234567b890143" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          View Shelter Map
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {latestTask.resourceType && (
                  <div className="a1234567b890138">
                    <div className="a1234567b890139">
                      <svg className="a1234567b890140" viewBox="0 0 24 24">
                        <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
                      </svg>
                      <h4>Resource Details</h4>
                    </div>
                    <div className="a1234567b890141">
                      <p><strong>Resource Type:</strong> {latestTask.resourceType}</p>
                    </div>
                  </div>
                )}

                {latestTask.deliveryDate && (
                  <div className="a1234567b890138">
                    <div className="a1234567b890139">
                      <svg className="a1234567b890140" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                      </svg>
                      <h4>Delivery Details</h4>
                    </div>
                    <div className="a1234567b890141">
                      <p><strong>Delivery Date & Time:</strong> {formatDate(latestTask.deliveryDate)}</p>
                    </div>
                  </div>
                )}
                
                <div className="a1234567b890144">
                  <button 
                    className="a1234567b890145"
                    onClick={() => navigateToMarkProgress(latestTask._id)}
                  >
                    <svg className="a1234567b890146" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Mark Progress
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="f123o4567">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AcceptedTasksView;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // You'll need to create this component
import '../styles/AdminTaskView.css';

const AdminTaskView = () => {
  const navigate = useNavigate();
  const [taskTypes, setTaskTypes] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch all task types on component mount
  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/list');
        setTaskTypes(response.data);
      } catch (err) {
        console.error('Error fetching task types:', err);
        setError('Failed to load task types');
        setMessage({ text: '❌ Failed to load task types', type: 'danger' });
      }
    };

    fetchTaskTypes();
  }, []);

  // Fetch tasks when a task type is selected
  useEffect(() => {
    if (selectedTaskType) {
      fetchTasks(selectedTaskType);
    }
  }, [selectedTaskType]);

  const fetchTasks = async (taskType) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/by-type/${taskType}`);
      
      // Group tasks by volunteer ID and find the latest one for each volunteer
      const tasksByVolunteer = {};
      
      response.data.forEach(task => {
        if (task.volunteer && task.volunteer.taskStatus !== 0) {
          const volunteerId = task.volunteer._id || task.volunteer.id;
          
          // If we don't have this volunteer yet, or if this task is newer than the one we have
          if (!tasksByVolunteer[volunteerId] || 
              new Date(task.createdAt) > new Date(tasksByVolunteer[volunteerId].createdAt)) {
            tasksByVolunteer[volunteerId] = task;
          }
        }
      });
      
      // Convert the object back to an array
      const latestTasksPerVolunteer = Object.values(tasksByVolunteer);
      
      setTasks(latestTasksPerVolunteer);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setMessage({ text: '❌ Failed to load tasks', type: 'danger' });
      setLoading(false);
    }
  };

  // Handle task type selection change
  const handleTaskTypeChange = (e) => {
    setSelectedTaskType(e.target.value);
  };

  // Get status text based on volunteer task status
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return ''; // Changed from 'Available' to empty string
      case 1:
        return 'Waiting for volunteer approval';
      case 2:
        return 'Task accepted by volunteer';
      case 3:
        return 'Task rejected by volunteer';
      case 4:
        return 'Task completed';
      default:
        return 'Unknown status';
    }
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return 'a67451b321462';
      case 1:
        return 'a67451b321463';
      case 2:
        return 'a67451b321464';
      case 3:
        return 'a67451b321465';
      case 4:
        return 'a67451b321466';
      default:
        return '';
    }
  };

  // Render appropriate details based on task type
  const renderTaskDetails = (task) => {
    switch (task.taskType) {
      case 'Transportation and Distribution':
        return (
          <div className="a67451b321467">
            <p><strong>Shelter:</strong> {task.shelter}</p>
            <p><strong>Resource Type:</strong> {task.resourceType}</p>
            <p><strong>Delivery Date & Time:</strong> {new Date(task.deliveryDateTime).toLocaleString()}</p>
          </div>
        );
      case 'Preparing and Serving Food':
        return (
          <div className="a67451b321467">
            <p><strong>Shelter:</strong> {task.shelter}</p>
          </div>
        );
      case 'Resource Distribution':
        return (
          <div className="a67451b321467">
            <p><strong>Shelter:</strong> {task.shelter}</p>
          </div>
        );
      case 'Rescue Operation Management':
      case 'Rescue Operator':
        return (
          <div className="a67451b321467">
            <p><strong>Incident:</strong> {task.incident ? `${task.incident.location} (${task.incident.type})` : 'N/A'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="a67451b321456">
      <AdminSidebar />
      <main className="a67451b321457">
        <div className="a67451b321458">
          <h2 className="a67451b321459">👁️ View Assigned Task Status</h2>
          
          {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}
          
          <div className="a67451b321460">
            <label htmlFor="taskType">Filter by Task Type:</label>
            <select
              id="taskType"
              value={selectedTaskType}
              onChange={handleTaskTypeChange}
            >
              <option value="">Select Task Type</option>
              {taskTypes.map(type => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <div className="a67451b321461">⏳ Loading tasks...</div>}

          {error && <div className="alert danger">{error}</div>}

          {!loading && !error && tasks.length === 0 && selectedTaskType && (
            <div className="a67451b321468">📭 No tasks found for the selected type.</div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="a67451b321469">
              {tasks.map(task => (
                <div key={task._id} className="a67451b321470">
                  <div className="a67451b321471">
                    <h3>{task.taskType}</h3>
                    <span className={`a67451b321472 ${getStatusClass(task.volunteer.taskStatus)}`}>
                      {getStatusText(task.volunteer.taskStatus)}
                    </span>
                  </div>

                  <div className="a67451b321473">
                    <div className="a67451b321474">
                      <p><strong>Description:</strong> {task.description}</p>
                      <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="a67451b321475">
                      <h4>📍 Incident Details</h4>
                      {task.incident ? (
                        <>
                          <p><strong>Location:</strong> {task.incident.location}</p>
                          <p><strong>Type:</strong> {task.incident.type}</p>
                          <p><strong>Severity:</strong> {task.incident.severity}</p>
                        </>
                      ) : (
                        <p>No incident details available</p>
                      )}
                    </div>

                    <div className="a67451b321476">
                      <h4>👤 Volunteer Details</h4>
                      {task.volunteer ? (
                        <>
                          <p><strong>Name:</strong> {task.volunteer.name || (task.volunteer.userId && task.volunteer.userId.name)}</p>
                          <p><strong>Email:</strong> {task.volunteer.email || (task.volunteer.userId && task.volunteer.userId.email)}</p>
                          <p><strong>Phone:</strong> {task.volunteer.phone || (task.volunteer.userId && task.volunteer.userId.phone) || 'N/A'}</p>
                        </>
                      ) : (
                        <p>No volunteer assigned</p>
                      )}
                    </div>

                    {/* Render type-specific details */}
                    {renderTaskDetails(task)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminTaskView;
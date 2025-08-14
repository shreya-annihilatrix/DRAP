import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import '../styles/VolunteerCompletedTasks.css';

const VolunteerCompletedTasks = ({ volunteerId }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [activeButton, setActiveButton] = useState(3); // Assuming completed tasks is button 3

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }
  
    const fetchCompletedTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/taskprogress/volunteer/${user.id}/completed`);
        const completed = response.data.filter(task => task.completed);
        setCompletedTasks(completed);
      } catch (err) {
        setError('Failed to fetch completed tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompletedTasks();
  }, [volunteerId, user, navigate]);
  
  const getTaskTypeSpecificDetails = (task) => {
    switch (task.taskId?.taskType) {
      case 'Transportation and Distribution':
        return (
          <div className="a123456789b0145">
            <p><span className="a123456789b0146">Delivery Status:</span> {task.deliveryStatus}</p>
          </div>
        );
      case 'Preparing and Serving Food':
        return (
          <div className="a123456789b0145">
            <p><span className="a123456789b0146">Meals Served:</span> {task.mealsServed}</p>
          </div>
        );
      case 'Rescue Operation Management':
        return (
          <div className="a123456789b0145">
            <p><span className="a123456789b0146">People Found:</span> {task.peopleFound}</p>
            <p><span className="a123456789b0146">People Hospitalized:</span> {task.peopleHospitalized}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getExpandedTaskDetails = (task) => {
    return (
      <div className="a123456789b0147">
        <h4 className="a123456789b0148">Detailed Information</h4>
        
        {/* Task Type Specific Additional Details */}
        {task.taskId?.taskType === 'Rescue Operation Management' && (
          <div className="a123456789b0149">
            <p><span className="a123456789b0146">People Missing:</span> {task.peopleMissing}</p>
            <p><span className="a123456789b0146">People Lost:</span> {task.peopleLost}</p>
          </div>
        )}
        
        {/* Progress Updates */}
        <div className="a123456789b0150">
          <h5 className="a123456789b0151">Updates History:</h5>
          {task.updates && task.updates.length > 0 ? (
            <ul className="a123456789b0152">
              {task.updates.map((update, index) => (
                <li key={index} className="a123456789b0153">
                  <p className="a123456789b0154">{update.description}</p>
                  <p className="a123456789b0155">
                    {format(new Date(update.timestamp), 'PPp')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="a123456789b0156">No updates recorded</p>
          )}
        </div>
        
        {/* Created and Last Updated Timestamps */}
        <div className="a123456789b0157">
          <p>Created: {format(new Date(task.createdAt), 'PPp')}</p>
          <p>Last Updated: {format(new Date(task.lastUpdated), 'PPp')}</p>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="a123456789b0100">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      <div className="a123456789b0101">
        <div className="a123456789b0102"></div>
        <p>Loading completed tasks...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="a123456789b0100">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      <div className="a123456789b0103">{error}</div>
    </div>
  );

  return (
    <div className="a123456789b0100">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a123456789b0104">
        <div className="a123456789b0105">
          <h2 className="a123456789b0106">Completed Tasks</h2>
          
          {completedTasks.length === 0 ? (
            <div className="a123456789b0107">
              <svg className="a123456789b0108" viewBox="0 0 24 24">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
              </svg>
              <p className="a123456789b0109">No completed tasks found</p>
            </div>
          ) : (
            <div className="a123456789b0110">
              {completedTasks.map((task) => (
                <div key={task._id} className="a123456789b0111">
                  {/* Basic Task Information */}
                  <div className="a123456789b0112">
                    <h3 className="a123456789b0113">
                      {task.taskId?.taskType || 'Unknown Task Type'}
                    </h3>
                    <span className="a123456789b0114">
                      Completed
                    </span>
                  </div>
                  
                  <p className="a123456789b0115">
                    {task.taskId?.description || 'No description available'}
                  </p>
                  
                  <div className="a123456789b0116">
                    <div className="a123456789b0117">
                      <div 
                        className="a123456789b0118" 
                        style={{ width: `100%` }}
                      ></div>
                    </div>
                    <p className="a123456789b0119">100% Complete</p>
                  </div>
                  
                  {/* Task Type Specific Basic Details */}
                  {getTaskTypeSpecificDetails(task)}
                  
                  {/* Progress Description */}
                  <div className="a123456789b0120">
                    <p><span className="a123456789b0146">Status:</span> {task.progressDescription}</p>
                  </div>
                  
                  {/* Toggle Button for Additional Details */}
                  <button
                    onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                    className="a123456789b0121"
                  >
                    {expandedTask === task._id ? 'Show Less' : 'Show More'}
                    <svg 
                      className={`a123456789b0122 ${expandedTask === task._id ? 'a123456789b0123' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Expanded Task Details */}
                  {expandedTask === task._id && getExpandedTaskDetails(task)}
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

export default VolunteerCompletedTasks;
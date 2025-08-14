import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import NavBar from '../components/Navbar';
import '../styles/MarkProgressForm.css';

const TaskProgressForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [task, setTask] = useState(null);
  const [activeButton, setActiveButton] = useState(3); // Assuming progress form is button 3
  const [formData, setFormData] = useState({
    progressDescription: '',
    progressPercentage: 0,
    completed: false,
    deliveryStatus: 'Not Started',
    mealsServed: '',
    peopleFound: '',
    peopleHospitalized: '',
    peopleMissing: '',
    peopleLost: '',
    updates: []
  });

  // Extract taskId from URL or state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const taskId = searchParams.get('taskId') || (location.state && location.state.taskId);
    
    if (!taskId) {
      setError('No task selected. Please go back and select a task.');
      return;
    }

    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
        setTask(response.data);
        
        try {
          const progressResponse = await axios.get(`http://localhost:5000/api/taskprogress/task/${taskId}`);
          if (progressResponse.data) {
            const formattedData = { ...progressResponse.data };
            ['mealsServed', 'peopleFound', 'peopleHospitalized', 'peopleMissing', 'peopleLost'].forEach(field => {
              if (formattedData[field] === 0) {
                formattedData[field] = '';
              }
            });
            setFormData(formattedData);
          }
        } catch (progressErr) {
          console.log("No existing progress found, using defaults");
        }
        
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load task details. Please try again.');
        console.error(err);
      }
    };

    fetchTaskDetails();
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!task || !user) {
      setError('Missing task or user information');
      return;
    }

    try {
      setLoading(true);
      
      const processedData = { ...formData };
      ['mealsServed', 'peopleFound', 'peopleHospitalized', 'peopleMissing', 'peopleLost'].forEach(field => {
        if (processedData[field] === '') {
          processedData[field] = 0;
        }
      });
      
      const submitData = {
        ...processedData,
        taskId: task._id,
        volunteerId: user.id,
        lastUpdated: new Date()
      };

      if (formData.progressDescription.trim()) {
        submitData.updates = [
          ...formData.updates,
          {
            description: formData.progressDescription,
            timestamp: new Date()
          }
        ];
      }

      const response = await axios.post('http://localhost:5000/api/taskprogress', submitData);
      setSuccess('Progress updated successfully!');
      
      setLoading(false);
      
      setTimeout(() => {
        if (formData.completed) {
          window.location.href = '/volunteer-home';
        } else {
          navigate('/volunteer-home');
        }
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Failed to update progress. Please try again.');
      console.error(err);
    }
  };

  const renderTaskSpecificFields = () => {
    if (!task) return null;

    switch (task.taskType) {
      case 'Transportation and Distribution':
        return (
          <div className="a12345678b90123">
            <h3 className="a12345678b90124">Transportation Details</h3>
            <div className="a12345678b90125">
              <label className="a12345678b90126">Delivery Status:</label>
              <select
                name="deliveryStatus"
                value={formData.deliveryStatus}
                onChange={handleInputChange}
                className="a12345678b90127"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        );
      case 'Preparing and Serving Food':
        return (
          <div className="a12345678b90123">
            <h3 className="a12345678b90124">Food Service Details</h3>
            <div className="a12345678b90125">
              <label className="a12345678b90126">Meals Served:</label>
              <input
                type="number"
                name="mealsServed"
                value={formData.mealsServed}
                onChange={handleInputChange}
                className="a12345678b90128"
                min="0"
                placeholder="Enter number of meals"
              />
            </div>
          </div>
        );
      case 'Rescue Operation Management':
        return (
          <div className="a12345678b90123">
            <h3 className="a12345678b90124">Rescue Operation Details</h3>
            <div className="a12345678b90125">
              <label className="a12345678b90126">People Found:</label>
              <input
                type="number"
                name="peopleFound"
                value={formData.peopleFound}
                onChange={handleInputChange}
                className="a12345678b90128"
                min="0"
                placeholder="Enter number"
              />
            </div>
            <div className="a12345678b90125">
              <label className="a12345678b90126">People Hospitalized:</label>
              <input
                type="number"
                name="peopleHospitalized"
                value={formData.peopleHospitalized}
                onChange={handleInputChange}
                className="a12345678b90128"
                min="0"
                placeholder="Enter number"
              />
            </div>
            <div className="a12345678b90125">
              <label className="a12345678b90126">People Missing:</label>
              <input
                type="number"
                name="peopleMissing"
                value={formData.peopleMissing}
                onChange={handleInputChange}
                className="a12345678b90128"
                min="0"
                placeholder="Enter number"
              />
            </div>
            <div className="a12345678b90125">
              <label className="a12345678b90126">People Lost:</label>
              <input
                type="number"
                name="peopleLost"
                value={formData.peopleLost}
                onChange={handleInputChange}
                className="a12345678b90128"
                min="0"
                placeholder="Enter number"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && !task) {
    return (
      <div className="a12345678b90129">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a12345678b90130">
          <div className="a12345678b90131"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="a12345678b90129">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a12345678b90132">{error}</div>
      </div>
    );
  }

  return (
    <div className="a12345678b90129">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a12345678b90133">
        <div className="a12345678b90134">
          <h2 className="a12345678b90135">Update Task Progress</h2>
          
          {task && (
            <div className="a12345678b90136">
              <h3 className="a12345678b90137">{task.taskType}</h3>
              <p className="a12345678b90138">{task.description}</p>
            </div>
          )}

          {error && <div className="a12345678b90139">{error}</div>}
          {success && <div className="a12345678b90140">{success}</div>}

          <form onSubmit={handleSubmit} className="a12345678b90141">
            <div className="a12345678b90123">
              <h3 className="a12345678b90124">General Progress</h3>
              <div className="a12345678b90125">
                <label className="a12345678b90126">Progress Description:</label>
                <textarea
                  name="progressDescription"
                  value={formData.progressDescription}
                  onChange={handleInputChange}
                  className="a12345678b90142"
                  rows="4"
                  placeholder="Describe your current progress..."
                  required
                />
              </div>

              <div className="a12345678b90125">
                <label className="a12345678b90126">Progress Percentage: {formData.progressPercentage}%</label>
                <input
                  type="range"
                  name="progressPercentage"
                  value={formData.progressPercentage}
                  onChange={handleInputChange}
                  className="a12345678b90143"
                  min="0"
                  max="100"
                  step="5"
                />
              </div>

              <div className="a12345678b90144">
                <label className="a12345678b90145">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={formData.completed}
                    onChange={handleInputChange}
                    className="a12345678b90146"
                  />
                  <span className="a12345678b90147">Mark as Completed</span>
                </label>
              </div>
            </div>

            {renderTaskSpecificFields()}

            <div className="a12345678b90148">
              <button 
                type="button" 
                className="a12345678b90149"
                onClick={() => navigate('/volunteer/accepted-tasks')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="a12345678b90150"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="a12345678b90151"></span>
                    Saving...
                  </>
                ) : 'Save Progress'}
              </button>
            </div>
          </form>

          {formData.updates && formData.updates.length > 0 && (
            <div className="a12345678b90152">
              <h3 className="a12345678b90153">Previous Updates</h3>
              <ul className="a12345678b90154">
                {formData.updates.map((update, index) => (
                  <li key={index} className="a12345678b90155">
                    <div className="a12345678b90156">
                      {new Date(update.timestamp).toLocaleString()}
                    </div>
                    <div className="a12345678b90157">{update.description}</div>
                  </li>
                ))}
              </ul>
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

export default TaskProgressForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import '../styles/TaskProgressReport.css';
const TaskProgressReport = () => {
  const [taskProgress, setTaskProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    taskType: '',
    status: ''
  });
   
  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      taskType: "",
      status: ""
    });
    fetchTaskProgress();
  };
  
  // Task type options
  const taskTypeOptions = ['Transportation and Distribution', 'Preparing and Serving Food', 'Rescue Operation Management', 'Rescue Operator', 'Resource Distribution', 'All'];
  
  // Status options
  const statusOptions = ['Completed', 'In Progress', 'All'];
  
  useEffect(() => {
    fetchTaskProgress();
  }, []);
  
  const fetchTaskProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.taskType && filters.taskType !== 'All') queryParams.append('taskType', filters.taskType);
      if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status === 'Completed' ? 'true' : 'false');
      
      const response = await axios.get(`http://localhost:5000/api/taskprogress?${queryParams}`);
      setTaskProgress(response.data);
    } catch (err) {
      setError('Failed to fetch task progress reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTaskProgress();
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const renderTaskDetails = (task) => {
    switch (task.task.taskType) {
      case 'Transportation and Distribution':
        return (
          <div className="a1432563b7485 a1432563b7486">
            <h4>Transportation and Distribution</h4>
            <p>Delivery Status: {task.deliveryStatus}</p>
          </div>
        );
      case 'Preparing and Serving Food':
        return (
          <div className="a1432563b7485 a1432563b7487">
            <h4>Preparing and Serving Food</h4>
            <p>Meals Served: {task.mealsServed}</p>
          </div>
        );
      case 'Rescue Operation Management':
        return (
          <div className="a1432563b7485 a1432563b7488">
            <h4>Rescue Operation Details</h4>
            <p>People Found: {task.peopleFound}</p>
            <p>People Hospitalized: {task.peopleHospitalized}</p>
            <p>People Missing: {task.peopleMissing}</p>
            <p>People Lost: {task.peopleLost}</p>
          </div>
        );
      case 'Resource Distribution':
        return null;
      default:
        return null;
    }
  };
  
  return (
    <div className="a1432563b7452">
      <AdminSidebar />
      <main className="a1432563b7453">
        <div className="a1432563b7454">
          <h1 className="a1432563b7455">
            <i className="fas fa-clipboard-list me-2"></i>Task Progress Reports
          </h1>
          
          <div className="a1432563b7456">
            <form onSubmit={handleFilterSubmit}>
              <div className="a1432563b7457">
                <div className="a1432563b7458">
                  <label htmlFor="fromDate" className="form-label">
                    <i className="fas fa-calendar-alt me-2"></i>From Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fromDate"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="a1432563b7458">
                  <label htmlFor="toDate" className="form-label">
                    <i className="fas fa-calendar-alt me-2"></i>To Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="toDate"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="a1432563b7458">
                  <label htmlFor="taskType" className="form-label">
                    <i className="fas fa-tasks me-2"></i>Task Type
                  </label>
                  <select
                    className="form-select"
                    id="taskType"
                    name="taskType"
                    value={filters.taskType}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Task Type</option>
                    {taskTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="a1432563b7458">
                  <label htmlFor="status" className="form-label">
                    <i className="fas fa-check-circle me-2"></i>Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div className="a1432563b7459">
                  <button type="submit" className="btn a1432563b7460">
                    <i className="fas fa-filter me-2"></i>Apply Filters
                  </button>
                  <button 
                    type="button" 
                    className="btn a1432563b7461" 
                    onClick={resetFilters}
                  >
                    <i className="fas fa-redo me-2"></i>Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {loading && (
            <div className="a1432563b7462">
              <i className="fas fa-spinner fa-spin me-2"></i>Loading task progress reports...
            </div>
          )}
          
          {error && <div className="a1432563b7463">{error}</div>}
          
          <div className="a1432563b7464">
            {taskProgress.length === 0 && !loading ? (
              <div className="a1432563b7465">No task progress reports found</div>
            ) : (
              taskProgress.map(task => (
                <div key={task._id} className="a1432563b7466">
                  <div className="a1432563b7467">
                    <div className="a1432563b7468">
                      <h3>{task.task.taskType}</h3>
                      <span className={`a1432563b7469 ${task.completed ? 'a1432563b7470' : 'a1432563b7471'}`}>
                        {task.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="a1432563b7472">
                      <div 
                        className="a1432563b7473" 
                        style={{ width: `${task.progressPercentage}%` }}
                      ></div>
                      <span className="a1432563b7474">{task.progressPercentage}%</span>
                    </div>
                  </div>
                  
                  <div className="a1432563b7475">
                    <p><strong>Description:</strong> {task.task.description}</p>
                    <p><strong>Incident:</strong> {task.task.incident}</p>
                    <p><strong>Progress Description:</strong> {task.progressDescription}</p>
                    <p><strong>Last Updated:</strong> {formatDate(task.lastUpdated)}</p>
                    
                    {renderTaskDetails(task)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskProgressReport;
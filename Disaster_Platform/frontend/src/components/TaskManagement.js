import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../styles/TaskManagement.css';

const TaskManagement = () => {
  const navigate = useNavigate();
  const [taskType, setTaskType] = useState('');
  const [description, setDescription] = useState('');
  const [incident, setIncident] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [shelter, setShelter] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [deliveryDateTime, setDeliveryDateTime] = useState('');

  const [shelterFood, setShelterFood] = useState('');
  const [rescueVolunteer, setRescueVolunteer] = useState('');

  const [taskTypes, setTaskTypes] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.error(err));
    
    if (skill) {
      axios.get(`http://localhost:5000/api/tasks/volunteers/${skill}`)
        .then(res => setVolunteers(res.data))
        .catch(err => console.error(err));
    }

    axios.get('http://localhost:5000/api/tasks/list')
      .then(res => setTaskTypes(res.data))
      .catch(err => console.error("Failed to fetch task types", err));

    axios.get('http://localhost:5000/api/tasks/res-types')
      .then(res => setResourceTypes(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Failed to fetch resource types", err);
        setResourceTypes([]);
      });

    axios.get('http://localhost:5000/api/tasks/incidents')
      .then(res => setIncidents(res.data))
      .catch(err => console.error("Failed to fetch incidents", err));

    axios.get('http://localhost:5000/api/tasks/shelters')
      .then(res => setShelters(res.data))
      .catch(err => console.error("Failed to fetch shelters", err));
  }, [skill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const task = { taskType, description, incident, volunteer };

    let extraData = {};

    if (task.taskType === "Transportation and Distribution") {
      extraData = { shelter, resourceType, deliveryDateTime };
    } else if (task.taskType === "Preparing and Serving Food") {
      extraData = { shelter };
    } else if (task.taskType === "Rescue Operation Management" || task.taskType === "Rescue Operator") {
      extraData = { incident };
    } else if (task.taskType === "Resource Distribution") {
      extraData = { shelter };
    }

    const selectedTask = taskTypes.find(task => task.name === taskType);

    axios.post('http://localhost:5000/api/tasks/add', { task, extraData })
      .then(() => {
        setMessage({ text: "✅ Task assigned successfully!", type: "success" });
        setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
      })
      .catch(err => {
        console.error(err);
        setMessage({ text: "❌ Error assigning task.", type: "danger" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="a6745b4321456">
      <AdminSidebar />
      <main className="a6745b4321457">
        <div className="a6745b4321458">
          <h2 className="a6745b4321459">📝 Task Management</h2>
          
          {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}
          
          <form onSubmit={handleSubmit} className="a6745b4321460">
            <div className="a6745b4321461">
              <label>Task Type</label>
              <select 
                value={taskType} 
                onChange={(e) => setTaskType(e.target.value)} 
                required
              >
                <option value="">Select Task Type</option>
                {taskTypes.map(type => <option key={type.name} value={type.name}>{type.name}</option>)}
              </select>
            </div>

            <div className="a6745b4321461">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>

            <div className="a6745b4321461">
              <label>Incident</label>
              <select 
                value={incident} 
                onChange={(e) => setIncident(e.target.value)} 
                required
              >
                <option value="">Select Incident</option>
                {incidents.map(inc => <option key={inc._id} value={inc._id}>{inc.location} Incident Type:{inc.type}</option>)}
              </select>
            </div>

            <div className="a6745b4321461">
              <label>Required Skill</label>
              <select 
                value={skill} 
                onChange={(e) => setSkill(e.target.value)} 
                required
              >
                <option value="">Select Required Skill</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div className="a6745b4321461">
              <label>Volunteer</label>
              <select 
                value={volunteer} 
                onChange={(e) => setVolunteer(e.target.value)} 
                required
              >
                <option value="">Select Volunteer</option>
                {volunteers.map(vol => <option key={vol._id} value={vol._id}>{vol.userId?.name}</option>)}
              </select>
            </div>

            {taskType === 'Transportation and Distribution' && (
              <div className="a6745b4321462">
                <div className="a6745b4321461">
                  <label>Shelter</label>
                  <select 
                    value={shelter} 
                    onChange={(e) => setShelter(e.target.value)} 
                    required
                  >
                    <option value="">Select Shelter</option>
                    {shelters.map(s => <option key={s._id} value={s._id}>{s.location}</option>)}
                  </select>
                </div>

                <div className="a6745b4321461">
                  <label>Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    required
                  >
                    <option value="">Select Resource Type</option>
                    {Array.isArray(resourceTypes) && resourceTypes.length > 0 ? (
                      resourceTypes.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))
                    ) : (
                      <option disabled>No resources available</option>
                    )}
                  </select>
                </div>

                <div className="a6745b4321461">
                  <label>Delivery Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={deliveryDateTime} 
                    onChange={(e) => setDeliveryDateTime(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            )}

            {(taskType === 'Preparing and Serving Food' || taskType === 'Resource Distribution') && (
              <div className="a6745b4321461">
                <label>Shelter</label>
                <select 
                  value={shelter} 
                  onChange={(e) => setShelter(e.target.value)} 
                  required
                >
                  <option value="">Select Shelter</option>
                  {shelters.map(s => <option key={s._id} value={s._id}>{s.location}</option>)}
                </select>
              </div>
            )}

            <button type="submit" className="a6745b4321463" disabled={loading}>
              {loading ? "Assigning..." : "➕ Assign Task"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TaskManagement;
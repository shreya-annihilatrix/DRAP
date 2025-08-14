import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "../styles/IncidentReportsPage.css";

// Map component to display incident location
const IncidentMap = ({ latitude, longitude }) => {
  return (
    <div className="ab123456789012">
      <iframe
        title="Incident Location"
        width="100%"
        height="200"
        frameBorder="0"
        src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Detail Modal Component
const IncidentDetailModal = ({ show, onClose, incident }) => {
  if (!show || !incident) {
    return null;
  }

  // Get severity label based on severity level
  const getSeverityLabel = (level) => {
    switch (level) {
      case 1: return "Very Low";
      case 2: return "Low";
      case 3: return "Medium";
      case 4: return "High";
      case 5: return "Critical";
      default: return "Unknown";
    }
  };

  // Get status label based on status code
  const getStatusLabel = (statusCode) => {
    switch (statusCode) {
      case 0: return "Reported";
      case 1: return "Under Investigation";
      case 2: return "Resolved";
      case 3: return "Closed";
      default: return "Unknown";
    }
  };

  return (
    <div className="ab123456789013">
      <div className="ab123456789014">
        <div className="ab123456789015">
          <h3>Incident Details</h3>
          <button className="ab123456789016" onClick={onClose}>&times;</button>
        </div>
        
        <div className="ab123456789017">
          <div className="ab123456789018">
            <div className="ab123456789019">
              <span className="ab123456789020">Location:</span>
              <span className="ab123456789021">{incident.location}</span>
            </div>
            <div className="ab123456789019">
              <span className="ab123456789020">Type:</span>
              <span className="ab123456789021">{incident.type}</span>
            </div>
            <div className="ab123456789019">
              <span className="ab123456789020">Severity:</span>
              <span className={`ab123456789021 ab123456789022-${incident.severity}`}>
                {getSeverityLabel(incident.severity)}
              </span>
            </div>
            <div className="ab123456789019">
              <span className="ab123456789020">Status:</span>
              <span className={`ab123456789021 ab123456789023-${incident.status}`}>
                {getStatusLabel(incident.status)}
              </span>
            </div>
            <div className="ab123456789019">
              <span className="ab123456789020">Reported On:</span>
              <span className="ab123456789021">{new Date(incident.createdAt).toLocaleString()}</span>
            </div>
            <div className="ab123456789019">
              <span className="ab123456789020">Description:</span>
              <span className="ab123456789021">{incident.description}</span> 
            </div>
          </div>
          
          <div className="ab123456789024">
            <h4>Location</h4>
            <IncidentMap latitude={incident.latitude} longitude={incident.longitude} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Response Modal Component for updating incident status
const ResponseModal = ({ show, onClose, onSubmit, incident, isSubmitting }) => {
  const [status, setStatus] = useState(incident?.status || 0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (incident) {
      setStatus(incident.status || 0);
      setNotes('');
    }
  }, [incident]);

  const handleStatusChange = (e) => {
    setStatus(parseInt(e.target.value));
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status, notes });
  };

  if (!show || !incident) {
    return null;
  }

  return (
    <div className="ab123456789025">
      <div className="ab123456789026">
        <div className="ab123456789027">
          <h3>Update Incident Status</h3>
          <button className="ab123456789016" onClick={onClose}>&times;</button>
        </div>
        
        <div className="ab123456789028">
          <div className="ab123456789029">
            <p><strong>Location:</strong> {incident.location}</p>
            <p><strong>Type:</strong> {incident.type}</p>
            <p><strong>Current Status:</strong> {
              incident.status === 0 ? "Reported" :
              incident.status === 1 ? "Under Investigation" :
              incident.status === 2 ? "Resolved" :
              incident.status === 3 ? "Closed" : "Unknown"
            }</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="ab123456789030">
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={handleStatusChange}
                required
                className="ab123456789031"
              >
                <option value="0">Reported</option>
                <option value="1">Under Investigation</option>
                <option value="2">Resolved</option>
                <option value="3">Closed</option>
              </select>
            </div>
            
            <div className="ab123456789030">
              <label htmlFor="notes">Notes (Optional):</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={notes}
                onChange={handleNotesChange}
                placeholder="Add any relevant notes about this status update..."
                className="ab123456789032"
              ></textarea>
            </div>
            
            <div className="ab123456789033">
              <button type="button" className="ab123456789034" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="ab123456789035" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const IncidentReportsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    type: "",
    severity: "",
    location: ""
  });
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const apiBaseUrl = "http://localhost:5000/api/incidents";

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiBaseUrl);
      setIncidents(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setError("Failed to load incidents. Please try again.");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.status) params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.location) params.append("location", filters.location);
      
      const response = await axios.get(`${apiBaseUrl}/filter?${params}`);
      setIncidents(response.data);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to filter incidents.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      type: "",
      severity: "",
      location: ""
    });
    await fetchIncidents();
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getSeverityInfo = (level) => {
    let label, className;
    
    switch (level) {
      case 1:
        label = "Very Low";
        className = "ab123456789036";
        break;
      case 2:
        label = "Low";
        className = "ab123456789037";
        break;
      case 3:
        label = "Medium";
        className = "ab123456789038";
        break;
      case 4:
        label = "High";
        className = "ab123456789039";
        break;
      case 5:
        label = "Critical";
        className = "ab123456789040";
        break;
      default:
        label = "Unknown";
        className = "";
    }
    
    return { label, className };
  };

  const getStatusInfo = (statusCode) => {
    let label, className;
    
    switch (statusCode) {
      case 0:
        label = "Reported";
        className = "ab123456789041";
        break;
      case 1:
        label = "Under Investigation";
        className = "ab123456789042";
        break;
      case 2:
        label = "Resolved";
        className = "ab123456789043";
        break;
      case 3:
        label = "Closed";
        className = "ab123456789044";
        break;
      default:
        label = "Unknown";
        className = "";
    }
    
    return { label, className };
  };

  const handleOpenDetailModal = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  const handleOpenResponseModal = (incident) => {
    setSelectedIncident(incident);
    setShowResponseModal(true);
    setSuccess("");
  };

  const handleSubmitStatusUpdate = async ({ status, notes }) => {
    if (!selectedIncident) {
      return;
    }

    setIsSubmitting(true);
    try {
      const responseData = await axios.patch(`${apiBaseUrl}/${selectedIncident._id}`, {
        status,
        notes
      });

      console.log("Status updated:", responseData.data);
      
      setIncidents(incidents.map(incident => 
        incident._id === selectedIncident._id 
          ? { 
              ...incident, 
              status,
              updatedAt: new Date().toISOString()
            } 
          : incident
      ));
      
      setSuccess("Incident status updated successfully!");
      setShowResponseModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update incident status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const incidentTypes = [...new Set(incidents.map(incident => incident.type))];
  const locations = [...new Set(incidents.map(incident => incident.location))];

  return (
    <div className="ab123456789045">
      <AdminSidebar />
      <main className="ab123456789046">
        <h2 className="ab123456789047">Incident Reports</h2>
        
        {success && (
          <div className="ab123456789048">
            {success}
            <button onClick={() => setSuccess("")} className="ab123456789016">×</button>
          </div>
        )}
        
        {error && (
          <div className="ab123456789049">
            {error}
            <button onClick={() => setError("")} className="ab123456789016">×</button>
          </div>
        )}
        
        <div className="ab123456789050">
          <div className="ab123456789051">
            <div className="ab123456789052">
              <div className="ab123456789053">
                <label>From Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={filters.startDate} 
                  onChange={handleFilterChange} 
                  className="ab123456789054"
                />
              </div>
              
              <div className="ab123456789053">
                <label>To Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={filters.endDate} 
                  onChange={handleFilterChange} 
                  className="ab123456789054"
                />
              </div>
              
              <div className="ab123456789053">
                <label>Status:</label>
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                  className="ab123456789055"
                >
                  <option value="">All Status</option>
                  <option value="0">Reported</option>
                  <option value="1">Under Investigation</option>
                  <option value="2">Resolved</option>
                  <option value="3">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="ab123456789052">
              <div className="ab123456789053">
                <label>Type:</label>
                <select 
                  name="type" 
                  value={filters.type} 
                  onChange={handleFilterChange}
                  className="ab123456789055"
                >
                  <option value="">All Types</option>
                  {incidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="ab123456789053">
                <label>Severity:</label>
                <select 
                  name="severity" 
                  value={filters.severity} 
                  onChange={handleFilterChange}
                  className="ab123456789055"
                >
                  <option value="">All Severity</option>
                  <option value="1">Very Low</option>
                  <option value="2">Low</option>
                  <option value="3">Medium</option>
                  <option value="4">High</option>
                  <option value="5">Critical</option>
                </select>
              </div>
              
              <div className="ab123456789053">
                <label>Location:</label>
                <select 
                  name="location" 
                  value={filters.location} 
                  onChange={handleFilterChange}
                  className="ab123456789055"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="ab123456789056">
              <button onClick={applyFilters} className="ab123456789057">Apply Filters</button>
              <button onClick={resetFilters} className="ab123456789058">Reset</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="ab123456789059">Loading incidents...</div>
        ) : incidents.length > 0 ? (
          <div className="ab123456789060">
            {incidents.map((incident) => {
              const severityInfo = getSeverityInfo(incident.severity);
              const statusInfo = getStatusInfo(incident.status);
              
              return (
                <div key={incident._id} className="ab123456789061">
                  <div className="ab123456789062">
                    <h3>{incident.type} at {incident.location}</h3>
                    <div className="ab123456789063">
                      <span className={`ab123456789064 ${severityInfo.className}`}>
                        {severityInfo.label}
                      </span>
                      <span className={`ab123456789065 ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ab123456789066">
                    <div className="ab123456789067">
                      <p className="ab123456789068">
                        {incident.description.length > 150 
                          ? `${incident.description.substring(0, 150)}...` 
                          : incident.description}
                      </p>
                      <p className="ab123456789069">
                        <span>Reported on: {formatDate(incident.createdAt)}</span>
                        {incident.updatedAt !== incident.createdAt && (
                          <span> | Updated: {formatDate(incident.updatedAt)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="ab123456789070">
                    <button 
                      className="ab123456789071"
                      onClick={() => handleOpenDetailModal(incident)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ab123456789072">
            <p>No incidents found matching your criteria.</p>
          </div>
        )}
        
        <IncidentDetailModal 
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          incident={selectedIncident}
        />
        
        <ResponseModal 
          show={showResponseModal}
          onClose={() => setShowResponseModal(false)}
          onSubmit={handleSubmitStatusUpdate}
          incident={selectedIncident}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
};

export default IncidentReportsPage;
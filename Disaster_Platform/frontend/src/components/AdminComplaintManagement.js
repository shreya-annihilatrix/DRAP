import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminComplaintManagement.css";

const AdminComplaintManagement = () => {
  const { user } = useUser();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: ""
  });
  
  // Response Modal Component
  const ResponseModal = ({ show, onClose, onSubmit, complaint, isSubmitting }) => {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('1');

    useEffect(() => {
      if (complaint) {
        setStatus(complaint.status || '1');
      }
    }, [complaint]);

    const handleResponseChange = (e) => {
      setResponse(e.target.value);
    };

    const handleStatusChange = (e) => {
      setStatus(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ response, status });
    };

    if (!show) {
      return null;
    }

    return (
      <div className="a123456789b012-modal-overlay">
        <div className="b223456789b012-modal">
          <div className="c323456789b012-modal-header">
            <h3 className="d423456789b012-modal-title">Respond to Complaint</h3>
            <button className="e523456789b012-close-btn" onClick={onClose}>&times;</button>
          </div>
          
          <div className="f623456789b012-modal-body">
            <div className="g723456789b012-complaint-info">
              <p className="h823456789b012-info-item"><strong>From:</strong> {complaint?.name || "Unknown"}</p>
              <p className="i923456789b012-info-item"><strong>Subject:</strong> {complaint?.subject || "No subject"}</p>
              <p className="j023456789b012-info-item"><strong>Complaint:</strong> {complaint?.description || "No description"}</p>
              <p className="k123456789b012-info-item"><strong>Date:</strong> {new Date(complaint?.createdAt).toLocaleString()}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="l223456789b012-response-form">
              <div className="m323456789b012-form-group">
                <label htmlFor="response" className="n423456789b012-form-label">Your Response:</label>
                <textarea
                  id="response"
                  name="response"
                  rows="4"
                  value={response}
                  onChange={handleResponseChange}
                  placeholder="Type your response to this complaint..."
                  required
                  className="o523456789b012-form-textarea"
                ></textarea>
              </div>
              
              <div className="p623456789b012-form-group">
                <label htmlFor="status" className="q723456789b012-form-label">Update Status:</label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={handleStatusChange}
                  required
                  className="r823456789b012-form-select"
                >
                  <option value="0">Open</option>
                  <option value="1">In Progress</option>
                  <option value="2">Resolved</option>
                  <option value="3">Closed</option>
                </select>
              </div>
              
              <div className="s923456789b012-modal-actions">
                <button type="button" className="t023456789b012-cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="u123456789b012-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  
  const complaintsBaseUrl = "http://localhost:5000/api/complaints";

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${complaintsBaseUrl}/all`);
      setComplaints(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again.");
      setComplaints([]);
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
      
      const response = await axios.get(`${complaintsBaseUrl}/filter?${params}`);
      setComplaints(response.data);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to filter complaints.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({ startDate: "", endDate: "", status: "" });
    await fetchComplaints();
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getStatusLabel = (statusCode) => {
    switch (statusCode) {
      case 0: return "Open";
      case 1: return "In Progress";
      case 2: return "Resolved";
      case 3: return "Closed";
      default: return "Unknown";
    }
  };

  const getStatusClass = (statusCode) => {
    switch (statusCode) {
      case 0: return "v223456789b012-status-open";
      case 1: return "w323456789b012-status-in-progress";
      case 2: return "x423456789b012-status-resolved";
      case 3: return "y523456789b012-status-closed";
      default: return "";
    }
  };

  const handleOpenResponseModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResponseModal(true);
    setSuccess("");
  };

  const handleSubmitResponse = async ({ response, status }) => {
    if (!selectedComplaint) return;

    setIsSubmittingResponse(true);
    try {
      await axios.post(`${complaintsBaseUrl}/respond`, {
        complaintId: selectedComplaint._id,
        adminId: user._id, 
        response: response,
        status: status
      });
      
      setComplaints(complaints.map(complaint => 
        complaint._id === selectedComplaint._id 
          ? { 
              ...complaint, 
              status: parseInt(status), 
              adminResponse: response,
              responseDate: new Date().toISOString()
            } 
          : complaint
      ));
      
      setSuccess("Response submitted successfully!");
      setShowResponseModal(false);
    } catch (error) {
      console.error("Error submitting response:", error);
      setError("Failed to submit response. Please try again.");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  return (
    <div className="a123456789b012">
      <AdminSidebar />
      <main className="b223456789b012-main">
        <div className="c323456789b012-container">
          <h2 className="d423456789b012-title">Complaint Management</h2>
          
          {success && (
            <div className="e523456789b012-success-message">
              {success}
              <button onClick={() => setSuccess("")} className="f623456789b012-close-btn">×</button>
            </div>
          )}
          
          {error && (
            <div className="g723456789b012-error-message">
              {error}
              <button onClick={() => setError("")} className="h823456789b012-close-btn">×</button>
            </div>
          )}
          
          <div className="i923456789b012-filter-section">
            <h4 className="j023456789b012-filter-title">Filter Complaints</h4>
            <div className="k123456789b012-filter-controls">
              <div className="l223456789b012-filter-group">
                <label className="m323456789b012-filter-label">From Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={filters.startDate} 
                  onChange={handleFilterChange}
                  className="n423456789b012-filter-input" 
                />
              </div>
              
              <div className="o523456789b012-filter-group">
                <label className="p623456789b012-filter-label">To Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={filters.endDate} 
                  onChange={handleFilterChange}
                  className="q723456789b012-filter-input"
                />
              </div>
              
              <div className="r823456789b012-filter-group">
                <label className="s923456789b012-filter-label">Status:</label>
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                  className="t023456789b012-filter-select"
                >
                  <option value="">All Status</option>
                  <option value="0">Open</option>
                  <option value="1">In Progress</option>
                  <option value="2">Resolved</option>
                  <option value="3">Closed</option>
                </select>
              </div>
              
              <div className="u123456789b012-filter-actions">
                <button onClick={applyFilters} className="v223456789b012-filter-button">Apply Filters</button>
                <button onClick={resetFilters} className="w323456789b012-reset-button">Reset</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="x423456789b012-loading">Loading complaints...</div>
          ) : complaints.length > 0 ? (
            <div className="y523456789b012-complaints-list">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="z623456789b012-complaint-card">
                  <div className="a723456789b012-complaint-header">
                    <h3 className="b823456789b012-complaint-title">{complaint.subject}</h3>
                    <span className={`c923456789b012-complaint-status ${getStatusClass(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                  
                  <div className="d023456789b012-complaint-content">
                    <div className="e123456789b012-complaint-info">
                      <p className="f223456789b012-info-item"><strong>From:</strong> {complaint.name}</p>
                      <p className="g323456789b012-info-item"><strong>Email:</strong> {complaint.email}</p>
                      <p className="h423456789b012-info-item"><strong>Submitted on:</strong> {formatDate(complaint.createdAt)}</p>
                      <p className="i523456789b012-info-item"><strong>Description:</strong> {complaint.description}</p>
                    </div>
                    
                    {complaint.adminResponse && (
                      <div className="j623456789b012-admin-response">
                        <h4 className="k723456789b012-response-title">Admin Response</h4>
                        <p className="l823456789b012-response-text">{complaint.adminResponse}</p>
                        <p className="m923456789b012-response-date">Responded on: {formatDate(complaint.responseDate)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="n023456789b012-complaint-actions">
                    <button 
                      className="o123456789b012-response-button"
                      onClick={() => handleOpenResponseModal(complaint)}
                    >
                      {complaint.adminResponse ? 'Update Response' : 'Respond'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p223456789b012-no-complaints">
              <p className="q323456789b012-no-complaints-text">No complaints found matching your criteria.</p>
            </div>
          )}
          
          <ResponseModal 
            show={showResponseModal}
            onClose={() => setShowResponseModal(false)}
            onSubmit={handleSubmitResponse}
            complaint={selectedComplaint}
            isSubmitting={isSubmittingResponse}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminComplaintManagement;
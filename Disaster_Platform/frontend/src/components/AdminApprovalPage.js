import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminApprovalPage.css";

const AdminApprovalPage = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/pending-volunteers");
      setVolunteers(response.data);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setError("Failed to load pending volunteers.");
    }
  };

  const handleApproval = async (volunteerId, status) => {
    try {
      const applicationStatus = status === "approved" ? 1 : 2;
      await axios.post("http://localhost:5000/api/admin/approve-volunteer", {
        volunteerId,
        applicationStatus,
      });
      alert(`Application ${status === "approved" ? "Accepted" : "Rejected"}`);
      setVolunteers((prevVolunteers) =>
        prevVolunteers.filter((volunteer) => volunteer._id !== volunteerId)
      );
    } catch (err) {
      console.error("Error updating volunteer status:", err);
      alert("Failed to update volunteer status.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return "status-pending";
      case 1: return "status-approved";
      case 2: return "status-rejected";
      default: return "";
    }
  };

  return (
    <div className="admin-approval-container">
      <AdminSidebar />

      <div className="main-content">
        <h2 className="page-title">Pending Volunteer Approvals</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="table-container">
          <table className="approval-table">
            <thead>
              <tr className="table-header">
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Phone</th>
                <th className="table-header-cell">Skills</th>
                <th className="table-header-cell">ID Proof</th>
                <th className="table-header-cell">Experience Certificate</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data-cell">
                    No pending approvals
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer) => (
                  <tr key={volunteer._id} className="table-row">
                    <td className="table-cell">
                      {volunteer.userId?.name || "N/A"}
                    </td>
                    <td className="table-cell">
                      {volunteer.userId?.email || "N/A"}
                    </td>
                    <td className="table-cell">
                      {volunteer.userId?.phone || "N/A"}
                    </td>
                    <td className="table-cell">
                      {volunteer.skills.join(", ")}
                    </td>
                    <td className="table-cell">
                      <a 
                        href={`http://localhost:5000/${volunteer.idProof}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        View
                      </a>
                    </td>
                    <td className="table-cell">
                      <a 
                        href={`http://localhost:5000/${volunteer.experienceCertificate}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        View
                      </a>
                    </td>
                    <td className={`table-cell ${getStatusClass(volunteer.applicationStatus)}`}>
                      {volunteer.applicationStatus === 0
                        ? "Pending"
                        : volunteer.applicationStatus === 1
                        ? "Accepted"
                        : "Rejected"}
                    </td>
                    <td className="table-cell">
                      <button 
                        onClick={() => handleApproval(volunteer._id, "approved")} 
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproval(volunteer._id, "rejected")} 
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovalPage;
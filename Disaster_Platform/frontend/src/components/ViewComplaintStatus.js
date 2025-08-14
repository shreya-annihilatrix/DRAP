import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import "../styles/ViewComplaintStatus.css";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(3); // Adjust based on your NavBar configuration

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!user || !user.id) {
          setError("User not authenticated");
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/complaints/user/${user.id}`);
        setComplaints(response.data.complaints);
        setLoading(false);
      } catch (error) {
        setError("Failed to load complaints. Please try again later.");
        setLoading(false);
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [user, navigate]);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closeDetails = () => {
    setSelectedComplaint(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Pending":
        return "a3bc45678901235";
      case "Under Review":
        return "a3bc45678901236";
      case "Resolved":
        return "a3bc45678901237";
      case "Dismissed":
        return "a3bc45678901238";
      default:
        return "a3bc45678901235";
    }
  };

  if (loading) {
    return (
      <div className="a3bc45678901234">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a3bc45678901239">
          <h2 className="a3bc45678901240">My Complaints</h2>
          <div className="a3bc45678901241">
            <div className="a3bc45678901242"></div>
            <p>Loading your complaints...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="a3bc45678901234">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a3bc45678901239">
          <h2 className="a3bc45678901240">My Complaints</h2>
          <div className="a3bc45678901243">{error}</div>
          <button onClick={() => navigate(-1)} className="a3bc45678901244">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="a3bc45678901234">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a3bc45678901239">
        <h2 className="a3bc45678901240">My Complaints</h2>
        
        {complaints.length === 0 ? (
          <div className="a3bc45678901245">
            <svg className="a3bc45678901246" viewBox="0 0 24 24">
              <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
            </svg>
            <p>You haven't submitted any complaints yet.</p>
            <button onClick={() => navigate("/report-complaint")} className="a3bc45678901247">
              Submit a Complaint
            </button>
          </div>
        ) : (
          <>
            <div className="a3bc45678901248">
              {complaints.map((complaint) => (
                <div key={complaint.reportedId} className="a3bc45678901249">
                  <div className="a3bc45678901250">
                    <span className="a3bc45678901251">#{complaint.reportedId}</span>
                    <span className={`a3bc45678901252 ${getStatusColorClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div className="a3bc45678901253">
                    <h3 className="a3bc45678901254">{complaint.complaintType}</h3>
                    <p className="a3bc45678901255">Submitted: {formatDate(complaint.createdAt)}</p>
                    <p className="a3bc45678901256">
                      {complaint.description.substring(0, 100)}
                      {complaint.description.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(complaint)} 
                    className="a3bc45678901257"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
            
            <div className="a3bc45678901258">
              <button onClick={() => navigate("/report-complaint")} className="a3bc45678901247">
                Submit New Complaint
              </button>
              <button onClick={() => navigate(-1)} className="a3bc45678901244">
                Back
              </button>
            </div>
          </>
        )}

        {/* Complaint Details Modal */}
        {selectedComplaint && (
          <div className="a3bc45678901259">
            <div className="a3bc45678901260">
              <div className="a3bc45678901261">
                <h3>Complaint Details</h3>
                <button className="a3bc45678901262" onClick={closeDetails}>×</button>
              </div>
              <div className="a3bc45678901263">
                <div className="a3bc45678901264">
                  <div className="a3bc45678901265">
                    <span className="a3bc45678901266">Reference ID:</span>
                    <span className="a3bc45678901267">{selectedComplaint.reportedId}</span>
                  </div>
                  <div className="a3bc45678901268">
                    <span className="a3bc45678901266">Status:</span>
                    <span className={`a3bc45678901252 ${getStatusColorClass(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
                
                <div className="a3bc45678901269">
                  <span className="a3bc45678901266">Complaint Type:</span>
                  <span className="a3bc45678901267">{selectedComplaint.complaintType}</span>
                </div>
                
                <div className="a3bc45678901269">
                  <span className="a3bc45678901266">Description:</span>
                  <p className="a3bc45678901270">{selectedComplaint.description}</p>
                </div>

                <div className="a3bc45678901271">
                  <div>
                    <span className="a3bc45678901266">Submitted on:</span>
                    <span className="a3bc45678901267">{formatDate(selectedComplaint.createdAt)}</span>
                  </div>
                  {selectedComplaint.updatedAt !== selectedComplaint.createdAt && (
                    <div>
                      <span className="a3bc45678901266">Last updated:</span>
                      <span className="a3bc45678901267">{formatDate(selectedComplaint.updatedAt)}</span>
                    </div>
                  )}
                </div>
                
                {selectedComplaint.adminComments && (
                  <div className="a3bc45678901272">
                    <span className="a3bc45678901266">Admin Comments:</span>
                    <p className="a3bc45678901273">{selectedComplaint.adminComments}</p>
                  </div>
                )}
              </div>
              <div className="a3bc45678901274">
                <button onClick={closeDetails} className="a3bc45678901275">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewComplaints;
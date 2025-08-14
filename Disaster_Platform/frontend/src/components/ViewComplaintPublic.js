import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/ViewComplaintPublic.css";

const ViewComplaintpublic = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

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
        return "a00001000000001";
      case "Under Review":
        return "a00001000000002";
      case "Resolved":
        return "a00001000000003";
      case "Dismissed":
        return "a00001000000004";
      default:
        return "a00001000000001";
    }
  };

  if (loading) {
    return (
      <div className="a00001000000005">
        <PublicNavbar />
        <div className="a00001000000006">
          <h2 className="a00001000000007">My Complaints</h2>
          <div className="a00001000000008">
            <div className="a00001000000009"></div>
            <p>Loading your complaints...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="a00001000000005">
        <PublicNavbar />
        <div className="a00001000000006">
          <h2 className="a00001000000007">My Complaints</h2>
          <div className="a00001000000010">{error}</div>
          <button onClick={() => navigate(-1)} className="a00001000000011">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="a00001000000005">
      <PublicNavbar />
      
      <main className="a00001000000006">
        <h2 className="a00001000000007">My Complaints</h2>
        
        {complaints.length === 0 ? (
          <div className="a00001000000012">
            <svg className="a00001000000013" viewBox="0 0 24 24">
              <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
            </svg>
            <p>You haven't submitted any complaints yet.</p>
            <button onClick={() => navigate("/report-complaint")} className="a00001000000014">
              Submit a Complaint
            </button>
          </div>
        ) : (
          <>
            <div className="a00001000000015">
              {complaints.map((complaint) => (
                <div key={complaint.reportedId} className="a00001000000016">
                  <div className="a00001000000017">
                    <span className="a00001000000018">#{complaint.reportedId}</span>
                    <span className={`a00001000000019 ${getStatusColorClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div className="a00001000000020">
                    <h3 className="a00001000000021">{complaint.complaintType}</h3>
                    <p className="a00001000000022">Submitted: {formatDate(complaint.createdAt)}</p>
                    <p className="a00001000000023">
                      {complaint.description.substring(0, 100)}
                      {complaint.description.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(complaint)} 
                    className="a00001000000024"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
            
            <div className="a00001000000025">
              <button onClick={() => navigate("/report-complaint")} className="a00001000000014">
                Submit New Complaint
              </button>
              <button onClick={() => navigate(-1)} className="a00001000000011">
                Back
              </button>
            </div>
          </>
        )}

        {/* Complaint Details Modal */}
        {selectedComplaint && (
          <div className="a00001000000026">
            <div className="a00001000000027">
              <div className="a00001000000028">
                <h3>Complaint Details</h3>
                <button className="a00001000000029" onClick={closeDetails}>×</button>
              </div>
              <div className="a00001000000030">
                <div className="a00001000000031">
                  <div className="a00001000000032">
                    <span className="a00001000000033">Reference ID:</span>
                    <span className="a00001000000034">{selectedComplaint.reportedId}</span>
                  </div>
                  <div className="a00001000000035">
                    <span className="a00001000000033">Status:</span>
                    <span className={`a00001000000019 ${getStatusColorClass(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
                
                <div className="a00001000000036">
                  <span className="a00001000000033">Complaint Type:</span>
                  <span className="a00001000000034">{selectedComplaint.complaintType}</span>
                </div>
                
                <div className="a00001000000036">
                  <span className="a00001000000033">Description:</span>
                  <p className="a00001000000037">{selectedComplaint.description}</p>
                </div>

                <div className="a00001000000038">
                  <div>
                    <span className="a00001000000033">Submitted on:</span>
                    <span className="a00001000000034">{formatDate(selectedComplaint.createdAt)}</span>
                  </div>
                  {selectedComplaint.updatedAt !== selectedComplaint.createdAt && (
                    <div>
                      <span className="a00001000000033">Last updated:</span>
                      <span className="a00001000000034">{formatDate(selectedComplaint.updatedAt)}</span>
                    </div>
                  )}
                </div>
                
                {selectedComplaint.adminComments && (
                  <div className="a00001000000039">
                    <span className="a00001000000033">Admin Comments:</span>
                    <p className="a00001000000040">{selectedComplaint.adminComments}</p>
                  </div>
                )}
              </div>
              <div className="a00001000000041">
                <button onClick={closeDetails} className="a00001000000042">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewComplaintpublic;
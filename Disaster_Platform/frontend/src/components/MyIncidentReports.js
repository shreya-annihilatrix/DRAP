import React, { useState, useEffect } from "react";
import axios from "axios";
import PublicNavbar from "../components/PublicNavbar";
import { useUser } from "../context/UserContext";
import "../styles/MyIncidentReports.css";

const MyIncidentReports = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserIncidents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/incidents/my-reports/${user.id}`);
        setIncidents(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error loading incidents. Please try again.");
        setLoading(false);
      }
    };

    fetchUserIncidents();
  }, [user.id]);

  const getSeverityText = (severity) => {
    const levels = ["Very Low", "Low", "Medium", "High", "Very High"];
    return levels[severity - 1] || "N/A";
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 0: return { text: "Pending", class: "a00000000000105" };
      case 1: return { text: "Verified", class: "a00000000000106" };
      case 2: return { text: "Deleted", class: "a00000000000107" };
      default: return { text: "Completed", class: "a00000000000108" };
    }
  };

  return (
    <div className="a00000000000101">
      <PublicNavbar />
      
      <main className="a00000000000102">
        <div className="a00000000000103">
          <h2 className="a00000000000104">My Incident Reports</h2>
          
          {loading ? (
            <div className="a00000000000109">
              <div className="a00000000000110"></div>
              <p>Loading your incident reports...</p>
            </div>
          ) : error ? (
            <div className="a00000000000111">
              <p>{error}</p>
              <button 
                className="a00000000000112" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : incidents.length === 0 ? (
            <div className="a00000000000113">
              <p>No incident reports found.</p>
              <p>You haven't reported any incidents yet.</p>
            </div>
          ) : (
            <div className="a00000000000114">
              <div className="a00000000000115">
                {incidents.map((incident) => (
                  <div key={incident._id} className="a00000000000116">
                    <div className="a00000000000117">
                      <h3 className="a00000000000118">{incident.location || "N/A"}</h3>
                      <div className="a00000000000119">
                        <span className="a00000000000120">Type:</span>
                        <span>{incident.type || "N/A"}</span>
                      </div>
                      <div className="a00000000000119">
                        <span className="a00000000000120">Severity:</span>
                        <span>{getSeverityText(incident.severity)}</span>
                      </div>
                      <div className="a00000000000119">
                        <span className="a00000000000120">Date:</span>
                        <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className={`a00000000000121 ${getStatusInfo(incident.status).class}`}>
                        {getStatusInfo(incident.status).text}
                      </div>
                    </div>
                    <div className="a00000000000122">
                      <p className="a00000000000123">{incident.description || "No description provided"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyIncidentReports;
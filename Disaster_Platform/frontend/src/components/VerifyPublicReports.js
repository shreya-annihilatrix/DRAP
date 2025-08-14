import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust path as needed
import "../styles/VerifyPublicReport.css";

const VerifyPublicReports = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapContainerStyle = { width: "100%", height: "500px" };

  // Memoize fetchIncidents to prevent unnecessary re-renders
  const fetchIncidents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/incidents/public-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(response.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const severityLabels = ["Very Low", "Low", "Medium", "High", "Very High"];
  const statusLabels = ["Pending", "Verified", "Deleted", "Completed"];

  // Severity class mapper function
  const getSeverityClass = (severity) => {
    const classes = [
      "v143256317s11", // Very Low
      "v143256317s12", // Low
      "v143256317s13", // Medium
      "v143256317s14", // High
      "v143256317s15", // Very High
    ];
    return classes[severity - 1] || classes[0];
  };

  // ✅ Verify Incident & Send Email Notification
  const verifyIncident = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/incidents/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message); // ✅ Displays message from backend
      fetchIncidents();
    } catch (error) {
      console.error("❌ Error verifying incident:", error.response?.data || error.message);
      alert(`❌ Failed to verify incident: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

// ✅ Delete Incident (removes from collection)
const deleteIncident = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/incidents/delete/${id}`);
    
    alert("🗑️ Incident removed successfully.");
    fetchIncidents();
  } catch (error) {
    console.error("Error deleting incident:", error.response?.data || error.message);
    alert(`❌ Failed to delete incident: ${error.response?.data?.message || "Unknown error"}`);
  }
};

  // Handle script load to prevent rerender
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  // Memoize the map component to avoid rerendering
  const showMap = useCallback((incident) => {
    setSelectedIncident(incident);
    setMapVisible(true);
  }, []);

  return (
    <div className="v143256317b52">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="v143256317m52">
        <div className="v143256317c52">
          <h2 className="v143256317h52">📢 Public Reported Incidents</h2>
          {/* <button className="v143256317bu1" onClick={() => navigate("/admin-incident-page")}>🏠 Back to Dashboard</button> */}

          {/* Responsive Table Container */}
          <div className="v143256317tc1">
            <table className="v143256317t52">
              <thead className="v143256317th1">
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Map</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="v143256317tb1">
                {incidents.map((incident) => (
                  <tr key={incident._id} className="v143256317tr1">
                    <td className="v143256317td1">{incident.type}</td>
                    <td className="v143256317td1">{incident.location}</td>
                    <td className={`v143256317td1 ${getSeverityClass(incident.severity)}`}>
                      {severityLabels[incident.severity - 1]}
                    </td>
                    <td className="v143256317td1 v143256317de1">{incident.description}</td>
                    <td className="v143256317td1">{statusLabels[incident.status]}</td>
                    <td className="v143256317td1">
                      <button className="v143256317mb1" onClick={() => showMap(incident)}>
                        🗺️ View on Map
                      </button>
                    </td>
                    <td className="v143256317td1">
                      {incident.status === 0 && (
                        <div className="v143256317ab1">
                          <button className="v143256317vb1" onClick={() => verifyIncident(incident._id)}>
                            ✅ Verify
                          </button>
                          <button className="v143256317db1" onClick={() => deleteIncident(incident._id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Map Popup - Only render when visible */}
          {mapVisible && selectedIncident && (
            <div className="v143256317mo1">
              <div className="v143256317mc1">
                <div className="v143256317mh1">
                  <h3>Location Details</h3>
                  <button className="v143256317cl1" onClick={() => setMapVisible(false)}>❌</button>
                </div>
                
                {!isScriptLoaded ? (
                  <div className="v143256317ld1">
                    <div className="v143256317sp1"></div>
                    <p>Loading map...</p>
                  </div>
                ) : null}
                
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} onLoad={handleScriptLoad}>
                  <div className="v143256317mp1">
                    <GoogleMap 
                      mapContainerStyle={mapContainerStyle} 
                      zoom={15} 
                      center={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
                      onLoad={map => {
                        mapRef.current = map;
                      }}
                    >
                      <Marker position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} />
                      <InfoWindow 
                        position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} 
                        onCloseClick={() => setMapVisible(false)}
                      >
                        <div className="v143256317iw1">
                          <h3>{selectedIncident.type}</h3>
                          <p>{selectedIncident.description}</p>
                          <p><strong>Severity:</strong> {severityLabels[selectedIncident.severity - 1]}</p>
                          <p><strong>Location:</strong> {selectedIncident.location}</p>
                        </div>
                      </InfoWindow>
                    </GoogleMap>
                  </div>
                </LoadScript>
                
                <div className="v143256317mb2">
                  <button className="v143256317cb1" onClick={() => setMapVisible(false)}>
                    Close Map
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyPublicReports;
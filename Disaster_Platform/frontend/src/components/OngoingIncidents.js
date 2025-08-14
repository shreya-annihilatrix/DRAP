import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api"; 
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Same as in AddShelter
import "../styles/OngoingIncidents.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const OngoingIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/incidents/ongoing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(response.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  const completeIncident = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/incidents/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Incident marked as completed! Volunteers have been notified.");
      fetchIncidents();
    } catch (error) {
      console.error("Error marking incident as completed:", error);
    }
  };

  // Handle script load
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 1: return "a1543276185b2"; // Very Low
      case 2: return "a1653287195b2"; // Low
      case 3: return "a1763298105b2"; // Medium
      case 4: return "a1873209115b2"; // High
      case 5: return "a1983210125b2"; // Very High
      default: return "";
    }
  };

  const getSeverityText = (severity) => {
    return ["Very Low", "Low", "Medium", "High", "Very High"][severity - 1];
  };

  return (
    <div className="a1012345678b2">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="a1123456789b2">
        <div className="a1234567890b2">
          <div className="a1345678901b2">
            <h2 className="a1456789012b2">🚨 Ongoing Incidents</h2>
            {/* <button 
              onClick={() => navigate("/admin-incident-page")} 
              className="a1567890123b2"
            >
              🏠 Back to Dashboard
            </button> */}
          </div>

          <div className="a1678901234b2">
            {incidents.length === 0 ? (
              <div className="a1789012345b2">
                <p>No ongoing incidents at this time.</p>
              </div>
            ) : (
              <div className="a1890123456b2">
                {incidents.map((incident) => (
                  <div key={incident._id} className="a1901234567b2">
                    <div className="a2012345678b2">
                      <div className={`a2123456789b2 ${getSeverityClass(incident.severity)}`}>
                        <span className="a2234567890b2">{getSeverityText(incident.severity)}</span>
                      </div>
                      <h3 className="a2345678901b2">{incident.type}</h3>
                    </div>
                    
                    <div className="a2456789012b2">
                      <p className="a2567890123b2"><strong>Location:</strong> {incident.location}</p>
                      <p className="a2678901234b2"><strong>Description:</strong> {incident.description}</p>
                    </div>
                    
                    <div className="a2789012345b2">
                      <button 
                        className="a2890123456b2" 
                        onClick={() => { setSelectedIncident(incident); setMapVisible(true); }}
                      >
                        🗺️ View on Map
                      </button>
                      <button 
                        className="a2901234567b2" 
                        onClick={() => completeIncident(incident._id)}
                      >
                        ✅ Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Map Overlay */}
      {mapVisible && selectedIncident && (
        <div className="a3012345678b2">
          <div className="a3123456789b2">
            <div className="a3234567890b2">
              <h3 className="a3345678901b2">Incident Location</h3>
              <button 
                className="a3456789012b2" 
                onClick={() => setMapVisible(false)}
              >
                ×
              </button>
            </div>
            
            <div className="a3567890123b2">
              <LoadScript
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                onLoad={handleScriptLoad}
              >
                {isScriptLoaded ? (
                  <GoogleMap 
                    zoom={15} 
                    center={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} 
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    onLoad={map => {
                      mapRef.current = map;
                    }}
                  >
                    <Marker position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} />
                    <InfoWindow 
                      position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} 
                      onCloseClick={() => setSelectedIncident(null)}
                    >
                      <div className="a3678901234b2">
                        <h4 className="a3789012345b2">{selectedIncident.type}</h4>
                        <p className="a3890123456b2">{selectedIncident.description}</p>
                        <p className="a3901234567b2">
                          <strong>Severity:</strong> {getSeverityText(selectedIncident.severity)}
                        </p>
                      </div>
                    </InfoWindow>
                  </GoogleMap>
                ) : (
                  <div className="a4012345678b2">
                    <div className="a4123456789b2">
                      <div className="a4234567890b2"></div>
                      <p>Loading map...</p>
                    </div>
                  </div>
                )}
              </LoadScript>
            </div>
            
            <div className="a4345678901b2">
              <button 
                className="a4456789012b2" 
                onClick={() => completeIncident(selectedIncident._id)}
              >
                ✅ Mark Incident as Completed
              </button>
              <button 
                className="a4567890123b2" 
                onClick={() => setMapVisible(false)}
              >
                🔙 Back to Incidents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingIncidents;
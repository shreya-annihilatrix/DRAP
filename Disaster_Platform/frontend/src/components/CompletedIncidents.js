import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../styles/CompletedIncidents.css";

const CompletedIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const navigate = useNavigate();

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/incidents/completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(response.data);
    } catch (error) {
      console.error("Error fetching completed incidents:", error);
    }
  };

  // Handle script load
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 1: return "awe3256317252-very-low";
      case 2: return "awe3256317252-low";
      case 3: return "awe3256317252-medium";
      case 4: return "awe3256317252-high";
      case 5: return "awe3256317252-very-high";
      default: return "";
    }
  };

  const getSeverityText = (severity) => {
    return ["Very Low", "Low", "Medium", "High", "Very High"][severity - 1];
  };

  return (
    <div className="awe3256317252-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="awe3256317252-main">
        <div className="awe3256317252-content">
          <div className="awe3256317252-header">
            <h2 className="awe3256317252-title">✅ Completed Incidents</h2>
          </div>

          <div className="awe3256317252-incidents-wrapper">
            {incidents.length === 0 ? (
              <div className="awe3256317252-no-incidents">
                <p>No completed incidents to display.</p>
              </div>
            ) : (
              <div className="awe3256317252-incidents-grid">
                {incidents.map((incident) => (
                  <div key={incident._id} className="awe3256317252-incident-card">
                    <div className="awe3256317252-card-header">
                      <div className={`awe3256317252-severity-badge ${getSeverityClass(incident.severity)}`}>
                        <span className="awe3256317252-severity-text">{getSeverityText(incident.severity)}</span>
                      </div>
                      <h3 className="awe3256317252-incident-type">{incident.type}</h3>
                    </div>
                    
                    <div className="awe3256317252-card-body">
                      <p className="awe3256317252-location"><strong>Location:</strong> {incident.location}</p>
                      <p className="awe3256317252-description"><strong>Description:</strong> {incident.description}</p>
                    </div>
                    
                    <div className="awe3256317252-card-actions">
                      <button 
                        className="awe3256317252-view-map-btn" 
                        onClick={() => { setSelectedIncident(incident); setMapVisible(true); }}
                      >
                        🗺️ View on Map
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
        <div className="awe3256317252-map-overlay">
          <div className="awe3256317252-map-container">
            <div className="awe3256317252-map-header">
              <h3 className="awe3256317252-map-title">Incident Location</h3>
              <button 
                className="awe3256317252-close-btn" 
                onClick={() => setMapVisible(false)}
              >
                ×
              </button>
            </div>
            
            <div className="awe3256317252-map-content">
              <LoadScript
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                onLoad={handleScriptLoad}
              >
                {isScriptLoaded ? (
                  <GoogleMap 
                    zoom={15} 
                    center={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} 
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                  >
                    <Marker position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} />
                    <InfoWindow 
                      position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }} 
                      onCloseClick={() => setSelectedIncident(null)}
                    >
                      <div className="awe3256317252-info-window">
                        <h4 className="awe3256317252-info-title">{selectedIncident.type}</h4>
                        <p className="awe3256317252-info-description">{selectedIncident.description}</p>
                        <p className="awe3256317252-info-severity">
                          <strong>Severity:</strong> {getSeverityText(selectedIncident.severity)}
                        </p>
                      </div>
                    </InfoWindow>
                  </GoogleMap>
                ) : (
                  <div className="awe3256317252-loading">
                    <div className="awe3256317252-loading-spinner">
                      <div className="awe3256317252-spinner"></div>
                      <p>Loading map...</p>
                    </div>
                  </div>
                )}
              </LoadScript>
            </div>
            
            <div className="awe3256317252-map-footer">
              <button 
                className="awe3256317252-back-btn" 
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

export default CompletedIncidents;
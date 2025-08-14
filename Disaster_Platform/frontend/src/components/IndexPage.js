import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import "../styles/IndexPage.css";

const IndexPage = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyShelters, setNearbyShelters] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default: Bangalore
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  // Date filtering states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredIncidents, setFilteredIncidents] = useState([]);

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);

  const SEARCH_RADIUS = 10000; // 10km in meters

  // Clear date filters
  const clearDateFilter = () => {
    // Reset date inputs
    setFromDate('');
    setToDate('');
    
    // Reset to show all verified incidents
    setFilteredIncidents(incidents);
  };

  // Get user's location on page load
  useEffect(() => {
    setLoading(true);
    
    // Fetch ongoing incidents
    fetchIncidents();
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(currentLocation);
          setMapCenter(currentLocation);
          findNearbyShelters(currentLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser");
      setLoading(false);
    }
  }, []);

  // Modify the fetchIncidents method to ensure it works correctly
  const fetchIncidents = async () => {
    try {
      // Prepare query parameters
      const params = {};

      // Add date filters if provided
      if (fromDate) {
        params.fromDate = new Date(fromDate).toISOString();
      }
      if (toDate) {
        params.toDate = new Date(toDate).toISOString();
      }

      // Fetch incidents with optional date filtering
      const response = await axios.get("http://localhost:5000/api/incidents/active", { 
        params 
      });

      // Filter out incidents with status 0 (only show verified incidents with status 1, 2, 3)
      const verifiedIncidents = response.data.filter(incident => incident.status > 0);
      
      // Apply date filtering on the client-side
      const dateFilteredIncidents = verifiedIncidents.filter(incident => {
        const incidentDate = new Date(incident.createdAt);
        
        // If no date filters are set, return all incidents
        if (!fromDate && !toDate) return true;
        
        // If only fromDate is set
        if (fromDate && !toDate) {
          return incidentDate >= new Date(fromDate);
        }
        
        // If only toDate is set
        if (!fromDate && toDate) {
          return incidentDate <= new Date(toDate);
        }
        
        // If both fromDate and toDate are set
        return incidentDate >= new Date(fromDate) && incidentDate <= new Date(toDate);
      });

      // Update both full incidents list and filtered incidents
      setIncidents(verifiedIncidents);
      setFilteredIncidents(dateFilteredIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  // Find shelters within 10km radius
  const findNearbyShelters = async (location) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shelters/nearby?lat=${location.lat}&lng=${location.lng}&radius=${SEARCH_RADIUS / 1000}`
      );
      setNearbyShelters(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error finding nearby shelters:", error);
      setLoading(false);
    }
  };

  // Search for shelters at a specific location
  const handleSearch = async () => {
    try {
      const address = document.getElementById("searchLocation").value;
      if (!address) return;

      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`

      );

      if (geocodeResponse.data.results.length > 0) {
        const location = geocodeResponse.data.results[0].geometry.location;
        setMapCenter({ lat: location.lat, lng: location.lng });
        findNearbyShelters({ lat: location.lat, lng: location.lng });
      } else {
        alert("Location not found. Please try another search term.");
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  // Handle date filter submission
  const handleDateFilter = () => {
    fetchIncidents();
  };
  
  // Get directions for a shelter and send them via email
  const handleGetDirections = (shelter) => {
    setSelectedShelter(shelter);
    setShowEmailForm(true);
    setEmailMessage('');
  };
  
  // Send directions via email
  const sendDirectionsEmail = async (e) => {
    e.preventDefault();
    if (!email || !selectedShelter) {
      setEmailMessage('Missing required information');
      return;
    }
  
    setSendingEmail(true);
    setEmailMessage('');
  
    try {
      const response = await axios.post('http://localhost:5000/api/shelters/send-directions', {
        shelterName: selectedShelter.location,
        shelterAddress: selectedShelter.location,
        userEmail: email,
        shelterLat: selectedShelter.latitude,
        shelterLng: selectedShelter.longitude
      });
  
      setEmailMessage('Directions sent to your email!');
      alert("email send to your email");
      setShowEmailForm(false);
      setEmail('');
    } catch (error) {
      console.error('Error sending directions email:', error);
      setEmailMessage('Failed to send directions. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = ["#FFD700", "#FFA500", "#FF8C00", "#FF4500", "#FF0000"];
    return colors[severity - 1] || "#FF0000";
  };

  // Get status text
  const getStatusText = (status) => {
    const statusMap = {
      0: "Reported",
      1: "Verified",
      2: "In Progress",
      3: "Resolved"
    };
    return statusMap[status] || "Unknown";
  };

  // Handle key press for search (allow Enter key to trigger search)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get severity badge class
  const getSeverityBadgeClass = (severity) => {
    return `a12345678901234567-severity-badge a12345678901234567-severity-${severity}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusClassMap = {
      1: "a12345678901234567-status-badge a12345678901234567-status-verified",
      2: "a12345678901234567-status-badge a12345678901234567-status-in-progress",
      3: "a12345678901234567-status-badge a12345678901234567-status-resolved"
    };
    return statusClassMap[status] || "";
  };

  return (
    <div className="a12345678901234567-index-container">
      <header className="a12345678901234567-header">
        <div>
          <h1>Disaster Relief Platform</h1>
        </div>
        <div className="a12345678901234567-auth-buttons">
          <button onClick={() => navigate("/login")} className="a12345678901234567-btn-login">Login</button>
          <button onClick={() => navigate("/signup")} className="a12345678901234567-btn-signup">Sign Up</button>
        </div>
      </header>

      <div className="a12345678901234567-search-section">
        <h2>Find Nearby Shelters</h2>
        <div className="a12345678901234567-search-box">
          <input
            type="text"
            id="searchLocation"
            placeholder="Enter your location..."
            onKeyPress={handleKeyPress}
            className="a12345678901234567-search-input"
          />
          <button onClick={handleSearch} className="a12345678901234567-search-button">Search</button>
        </div>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="a12345678901234567-email-modal">
          <div className="a12345678901234567-email-modal-content">
            <h3>Get Directions to {selectedShelter?.location}</h3>
            <p>We'll send a link that will open directions from your current location when you use it.</p>
            
            <form onSubmit={sendDirectionsEmail}>
              <input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="a12345678901234567-email-input"
              />
              <div className="a12345678901234567-email-modal-buttons">
                <button 
                  type="submit" 
                  className="a12345678901234567-send-email-btn"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? 'Sending...' : 'Send Directions'}
                </button>
                <button 
                  type="button" 
                  className="a12345678901234567-cancel-btn"
                  onClick={() => setShowEmailForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
            
            {emailMessage && <p className="a12345678901234567-email-message">{emailMessage}</p>}
          </div>
        </div>
      )}

      <div className="a12345678901234567-map-container">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            zoom={12}
            center={mapCenter}
          >
            {/* User Location Marker */}
            {userLocation && (
              <>
                <Marker
                  position={userLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }}
                />
                <Circle
                  center={userLocation}
                  radius={SEARCH_RADIUS}
                  options={{
                    strokeColor: "#0088FF",
                    strokeOpacity: 0.3,
                    strokeWeight: 2,
                    fillColor: "#0088FF",
                    fillOpacity: 0.1,
                  }}
                />
              </>
            )}

            {/* Shelter Markers */}
            {nearbyShelters.map((shelter) => (
              <Marker
                key={shelter._id}
                position={{ lat: shelter.latitude, lng: shelter.longitude }}
                icon={{
                  url: shelter.available
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                }}
                onClick={() => setSelectedShelter(shelter)}
              />
            ))}

            {/* Incident Markers - Only displaying verified incidents (status > 0) */}
            {incidents.map((incident) => (
              <Marker
                key={incident._id}
                position={{ lat: incident.latitude, lng: incident.longitude }}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE,
                  fillColor: getSeverityColor(incident.severity),
                  fillOpacity: 0.7,
                  strokeWeight: 2,
                  strokeColor: "#FFFFFF",
                  scale: 10
                }}
                onClick={() => setSelectedIncident(incident)}
              />
            ))}

            {/* Shelter Info Window */}
            {selectedShelter && (
              <InfoWindow
                position={{ lat: selectedShelter.latitude, lng: selectedShelter.longitude }}
                onCloseClick={() => setSelectedShelter(null)}
              >
                <div className="a12345678901234567-info-window">
                  <h3>Shelter</h3>
                  <p><strong>Location:</strong> {selectedShelter.location}</p>
                  <p><strong>Capacity:</strong> {selectedShelter.inmates}/{selectedShelter.totalCapacity}</p>
                  <p><strong>Status:</strong> {selectedShelter.available ? "Available" : "Full"}</p>
                  <p><strong>Contact:</strong> {selectedShelter.contactDetails}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(selectedShelter);
                    }}
                    className="a12345678901234567-directions-btn"
                  >
                    Get Directions
                  </button>
                </div>
              </InfoWindow>
            )}

            {/* Incident Info Window */}
            {selectedIncident && (
              <InfoWindow
                position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
                onCloseClick={() => setSelectedIncident(null)}
              >
                <div className="a12345678901234567-info-window">
                  <h3>Incident: {selectedIncident.type}</h3>
                  <p><strong>Location:</strong> {selectedIncident.location}</p>
                  <p>
                    <strong>Severity:</strong> {selectedIncident.severity}/5
                    <span className={getSeverityBadgeClass(selectedIncident.severity)}></span>
                  </p>
                  <p>
                    <strong>Status:</strong> {getStatusText(selectedIncident.status)}
                    <span className={getStatusBadgeClass(selectedIncident.status)}></span>
                  </p>
                  <p><strong>Description:</strong> {selectedIncident.description}</p>
                </div>
              </InfoWindow>
            )}

            {/* Map Legend */}
            <div className="a12345678901234567-map-legend">
              <div className="a12345678901234567-legend-item">
                <div className="a12345678901234567-legend-color" style={{backgroundColor: "#0088FF"}}></div>
                <span>Your Location</span>
              </div>
              <div className="a12345678901234567-legend-item">
                <div className="a12345678901234567-legend-color" style={{backgroundColor: "#4caf50"}}></div>
                <span>Available Shelter</span>
              </div>
              <div className="a12345678901234567-legend-item">
                <div className="a12345678901234567-legend-color" style={{backgroundColor: "#ff9800"}}></div>
                <span>Full Shelter</span>
              </div>
              <div className="a12345678901234567-legend-item">
                <div className="a12345678901234567-legend-color" style={{backgroundColor: "#ff0000"}}></div>
                <span>Incident</span>
              </div>
            </div>
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="a12345678901234567-shelters-list">
        <h2>Nearby Shelters</h2>
        {loading ? (
          <div className="a12345678901234567-loading-shelters">Loading shelters...</div>
        ) : nearbyShelters.length > 0 ? (
          <div className="a12345678901234567-shelter-cards">
            {nearbyShelters.map((shelter) => (
              <div className={`a12345678901234567-shelter-card ${shelter.available ? "available" : "full"}`} key={shelter._id}>
                <h3>{shelter.location}</h3>
                <p><strong>Capacity:</strong> {shelter.inmates}/{shelter.totalCapacity}</p>
                <p><strong>Status:</strong> {shelter.available ? "Available" : "Full"}</p>
                <p><strong>Contact:</strong> {shelter.contactDetails}</p>
                <div className="a12345678901234567-shelter-card-buttons">
                  <button 
                    onClick={() => {
                      setMapCenter({ lat: shelter.latitude, lng: shelter.longitude });
                      setSelectedShelter(shelter);
                    }}
                    className="a12345678901234567-view-map-btn"
                  >
                    View on Map
                  </button>
                  <button 
                    onClick={() => handleGetDirections(shelter)}
                    className="a12345678901234567-directions-btn"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No shelters found in the specified area.</p>
        )}
      </div>

      <div className="a12345678901234567-incidents-section">
        <h2>Active Verified Incidents</h2>
        
        {/* Date Filter Section */}
        <div className="a12345678901234567-date-filter-section">
          <h3>Filter Incidents by Date</h3>
          <div className="a12345678901234567-date-filter-container">
            <div className="a12345678901234567-date-input-wrapper">
              <div className="a12345678901234567-date-input-group">
                <label>From:</label>
                <input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)} 
                  className="a12345678901234567-date-input"
                />
              </div>
              <div className="a12345678901234567-date-input-group">
                <label>To:</label>
                <input 
                  type="date" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)} 
                  className="a12345678901234567-date-input"
                />
              </div>
            </div>
            <div className="a12345678901234567-date-filter-buttons">
              <button 
                onClick={handleDateFilter} 
                className="a12345678901234567-apply-filter-btn"
                disabled={!fromDate && !toDate}
              >
                Apply Filter
              </button>
              <button 
                onClick={clearDateFilter} 
                className="a12345678901234567-clear-filter-btn"
                disabled={!fromDate && !toDate}
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>

        {/* Weather Indicator - New Feature */}
        <div className="a12345678901234567-weather-indicator">
          <div className="a12345678901234567-weather-icon">☀️</div>
          <div className="a12345678901234567-weather-info">
            <div className="a12345678901234567-weather-temp">32°C</div>
            <div className="a12345678901234567-weather-desc">Clear sky, light winds</div>
          </div>
        </div>
        
        {filteredIncidents.length > 0 ? (
          <div className="a12345678901234567-incident-cards">
            {filteredIncidents.map((incident) => (
              <div 
                className="a12345678901234567-incident-card" 
                key={incident._id} 
                style={{ borderLeft: `5px solid ${getSeverityColor(incident.severity)}` }}
              >
                <h3>{incident.type}</h3>
                <p><strong>Location:</strong> {incident.location}</p>
                <p>
                  <strong>Severity:</strong> {incident.severity}/5
                  <span className={getSeverityBadgeClass(incident.severity)}></span>
                </p>
                <p>
                  <strong>Status:</strong> {getStatusText(incident.status)}
                  <span className={getStatusBadgeClass(incident.status)}></span>
                </p>
                <p><strong>Description:</strong> {incident.description}</p>
                <p><strong>Date:</strong> {new Date(incident.createdAt).toLocaleDateString()}</p>
                <button 
                  onClick={() => {
                    setMapCenter({ lat: incident.latitude, lng: incident.longitude });
                    setSelectedIncident(incident);
                  }}
                  className="a12345678901234567-view-map-btn"
                >
                  View on Map
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="a12345678901234567-alert a12345678901234567-alert-info">
            No incidents found matching the selected date range.
          </div>
        )}
      </div>

      <footer className="a12345678901234567-footer">
        <p>© 2025 Disaster Relief Platform | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </footer>
    </div>
  );
};

export default IndexPage;
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import PublicNavbar from "../components/PublicNavbar";
import { useUser } from "../context/UserContext";
import "../styles/IncidentReport.css";

const ReportIncident = () => {
  const [form, setForm] = useState({ location: "", type: "", severity: 1, description: "" });
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const { user } = useUser();

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Fetch current location on component mou
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarker({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Could not fetch your location. Please select manually.");
          setLocationLoading(false);
          setMarker({ lat: 12.9716, lng: 77.5946 });
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      setMarker({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results && response.data.results[0]) {
        setForm(prev => ({ ...prev, location: response.data.results[0].formatted_address }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleMapClick = (e) => {
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    reverseGeocode(e.latLng.lat(), e.latLng.lng());
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      setMarker({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setForm({ ...form, location: place.formatted_address });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!marker) {
      alert("Please select a location on the map!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/incidents/report", {
        location: form.location,
        type: form.type,
        severity: form.severity,
        description: form.description,
        latitude: marker.lat,
        longitude: marker.lng,
        userId: user.id
      });

      alert(response.data.message);
      navigate("/public-home");
    } catch (error) {
      console.error("Error submitting incident:", error.response?.data || error.message);
      alert("Error reporting incident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="az12345678901234">
      <PublicNavbar />
      
      <main className="az12345678901235">
        <div className="az12345678901236">
          <h2 className="az12345678901237">Report an Incident</h2>
          <p className="az12345678901238">Ensure incident details are accurate before submitting.</p>

          {locationLoading && (
            <div className="az12345678901239">
              <span className="az12345678901240"></span>
              Fetching your current location...
            </div>
          )}

          {locationError && (
            <div className="az12345678901241">
              {locationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="az12345678901242">
            <div className="az12345678901243">
              <label className="az12345678901244">Search Location:</label>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                <Autocomplete 
                  onLoad={(ref) => (autocompleteRef.current = ref)} 
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input 
                    type="text" 
                    placeholder="Search for a location..." 
                    className="az12345678901245" 
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </Autocomplete>

                <div className="az12345678901246">
                  {marker && (
                    <GoogleMap 
                      mapContainerStyle={{ width: "100%", height: "100%" }} 
                      zoom={15}
                      center={marker}
                      onClick={handleMapClick}
                    >
                      <Marker position={marker} />
                    </GoogleMap>
                  )}
                </div>
              </LoadScript>
            </div>

            <div className="az12345678901247">
              <div className="az12345678901248">
                <label className="az12345678901244">Location Name:</label>
                <input 
                  type="text" 
                  value={form.location} 
                  placeholder="Enter location name"
                  onChange={(e) => setForm({ ...form, location: e.target.value })} 
                  className="az12345678901249"
                  required 
                />
              </div>

              <div className="az12345678901248">
                <label className="az12345678901244">Incident Type:</label>
                <select 
                  value={form.type} 
                  onChange={(e) => setForm({ ...form, type: e.target.value })} 
                  className="az12345678901249"
                  required
                >
                  <option value="" disabled>Select Incident Type</option>
                  <option value="Fire">Fire</option>
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Accident">Accident</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="az12345678901248">
                <label className="az12345678901244">Severity Level:</label>
                <select 
                  value={form.severity} 
                  onChange={(e) => setForm({ ...form, severity: e.target.value })} 
                  className="az12345678901249"
                  required
                >
                  <option value="1">Very Low</option>
                  <option value="2">Low</option>
                  <option value="3">Medium</option>
                  <option value="4">High</option>
                  <option value="5">Very High</option>
                </select>
              </div>

              <div className="az12345678901248">
                <label className="az12345678901244">Description:</label>
                <textarea 
                  placeholder="Describe the incident..."
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  className="az12345678901250"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="az12345678901251" disabled={loading}>
              {loading ? (
                <>
                  <span className="az12345678901240"></span>
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        </div>
      </main>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ReportIncident;
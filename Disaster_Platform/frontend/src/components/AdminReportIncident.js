import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import AdminSidebar from "./AdminSidebar"; // Adjust path as needed
import "../styles/AdminReportIncident.css";
import { useUser } from "../context/UserContext";

const AdminReportIncident = () => {
  const { user } = useUser();
  const [form, setForm] = useState({ location: "", type: "", severity: 1, description: "" });
  const [marker, setMarker] = useState(null);
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const libraries = ["places"];

  // Get user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          // Reverse geocode to get address from coordinates
          fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          // Keep default coordinates if user denies permission
          setMarker({ lat: 12.9716, lng: 77.5946 });
        }
      );
    }
  }, []);

  // Fetch address from coordinates
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        setForm(prev => ({ ...prev, location: response.data.results[0].formatted_address }));
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });

    // Reverse Geocode to get Address from Lat/Lng
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        setForm(prev => ({ ...prev, location: response.data.results[0].formatted_address }));
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        setMarker({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setForm((prev) => ({ ...prev, location: place.formatted_address }));

        // Center the map on the selected location
        if (mapRef.current) {
          mapRef.current.panTo({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          mapRef.current.setZoom(15);
        }
      }
    }
  };

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!marker) return alert("⚠️ Please select a location on the map!");
  
    try {
      // ✅ Step 1: Report the Incident
      const response = await axios.post(
        "http://localhost:5000/api/incidents/add",
        {
          location: form.location,
          type: form.type,
          severity: form.severity,
          description: form.description,
          latitude: marker.lat,
          longitude: marker.lng,
          status: 1, // ✅ Automatically mark as Verified
          userId: user.id
        }
      );
  
      alert("✅ Incident added successfully and marked as Verified!");
      alert("📧 Email notifications sent to all volunteers.");
      navigate("/admin-home");
    } catch (error) {
      console.error("❌ Error submitting incident:", error.response?.data || error.message);
      alert("❌ Error adding incident or sending email. Please try again.");
    }
  };
  
  return (
    <div className="a14325631b452">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="b14325631c452">
        <div className="c14325631d452">
          <h2 className="d14325631e452">📍 Add Verified Incident</h2>
          <p className="e14325631f452">⚠️ Ensure all details are accurate before submission.</p>

          <form onSubmit={handleSubmit} className="f14325631g452">
            {/* Google Maps Search Box and Map */}
            <div className="g14325631h452">
              <LoadScript
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                libraries={libraries}
                onLoad={handleScriptLoad}
              >
                {isScriptLoaded ? (
                  <>
                    <Autocomplete
                      onLoad={(ref) => (autocompleteRef.current = ref)}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        type="text"
                        placeholder="Search for a location..."
                        className="h14325631i452"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </Autocomplete>

                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "400px" }}
                      zoom={12}
                      center={marker || { lat: 12.9716, lng: 77.5946 }}
                      onClick={handleMapClick}
                      onLoad={map => {
                        mapRef.current = map;
                      }}
                    >
                      {marker && <Marker position={marker} />}
                    </GoogleMap>
                  </>
                ) : (
                  <div className="i14325631j452">
                    <div className="j14325631k452">
                      <div className="k14325631l452"></div>
                      <p>Loading map...</p>
                    </div>
                  </div>
                )}
              </LoadScript>
            </div>

            {/* Location Name Field */}
            <div className="l14325631m452">
              <label className="m14325631n452">📍 Location Name:</label>
              <input 
                type="text" 
                value={form.location} 
                placeholder="Enter location name" 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                required 
                className="n14325631o452"
              />
            </div>

            {/* Incident Type Field */}
            <div className="o14325631p452">
              <label className="p14325631q452">🔥 Incident Type:</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })} 
                required
                className="q14325631r452"
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

            {/* Severity Level Field */}
            <div className="r14325631s452">
              <label className="s14325631t452">⚠️ Severity Level:</label>
              <select 
                value={form.severity} 
                onChange={(e) => setForm({ ...form, severity: e.target.value })} 
                required
                className="t14325631u452"
              >
                <option value="1">Very Low</option>
                <option value="2">Low</option>
                <option value="3">Medium</option>
                <option value="4">High</option>
                <option value="5">Very High</option>
              </select>
            </div>

            {/* Description Field */}
            <div className="u14325631v452">
              <label className="v14325631w452">📝 Description:</label>
              <textarea 
                placeholder="Describe the incident..." 
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                required 
                className="w14325631x452"
              />
            </div>

            <button 
              type="submit" 
              className="x14325631y452"
            >
              🚀 Add Verified Incident
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminReportIncident;
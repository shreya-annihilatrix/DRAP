import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import AdminSidebar from "./AdminSidebar"; // Adjust path as needed
import "../styles/AddShelter.css";

const AddShelter = () => {
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState(12.9716); // Default will be overridden by user's location
    const [longitude, setLongitude] = useState(77.5946);
    const [totalCapacity, setTotalCapacity] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [assignedVolunteer, setAssignedVolunteer] = useState("");
    const [volunteers, setVolunteers] = useState([]);
    const [errors, setErrors] = useState({});
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();
    const mapRef = useRef(null);

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const libraries = ["places"];

    // Get user's current location when component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    
                    // Reverse geocode to get the address from coordinates
                    fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                    // Keep default coordinates if user denies permission
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
                setLocation(response.data.results[0].formatted_address);
            }
        } catch (error) {
            console.error("Error getting address:", error);
        }
    };

    // Fetch available volunteers
    useEffect(() => {
        axios.get("http://localhost:5000/api/users/available-volunteers")
            .then(response => setVolunteers(response.data))
            .catch(error => console.error("Error fetching volunteers", error));
    }, []);

    // Function to validate form
    const validateForm = () => {
        let tempErrors = {};
        let formIsValid = true;

        // Validate capacity
        if (!totalCapacity || parseInt(totalCapacity) < 1) {
            tempErrors.totalCapacity = "Capacity must be at least 1";
            formIsValid = false;
        }

        // Validate contact (phone number format)
        const phoneRegex = /^\d{10}$/;
        if (!contactNumber || !phoneRegex.test(contactNumber)) {
            tempErrors.contactNumber = "Please enter a valid 10-digit phone number";
            formIsValid = false;
        }

        // Validate location
        if (!location) {
            tempErrors.location = "Location is required";
            formIsValid = false;
        }

        // Validate coordinates
        if (!latitude || !longitude) {
            tempErrors.coordinates = "Please select a location on the map";
            formIsValid = false;
        }

        // Validate volunteer assignment
        if (!assignedVolunteer) {
            tempErrors.assignedVolunteer = "Please select a volunteer";
            formIsValid = false;
        }

        setErrors(tempErrors);
        return formIsValid;
    };

    // Function to handle location selection from search box
    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.geometry) {
                setLocation(place.formatted_address);
                setLatitude(place.geometry.location.lat());
                setLongitude(place.geometry.location.lng());
                
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

    // Function to handle map click (update location dynamically)
    const handleMapClick = async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLatitude(lat);
        setLongitude(lng);

        // Reverse Geocode to get Address from Lat/Lng
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            if (response.data.results.length > 0) {
                setLocation(response.data.results[0].formatted_address);
            }
        } catch (error) {
            console.error("Error getting address:", error);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const shelterData = { 
            location, 
            latitude, 
            longitude, 
            totalCapacity: parseInt(totalCapacity), 
            inmates: 0, 
            contactDetails: contactNumber, 
            assignedVolunteer 
        };

        try {
            await axios.post("http://localhost:5000/api/shelters/add", shelterData);
            alert("✅ Shelter added successfully!");
            navigate("/admin-home");
        } catch (error) {
            alert("❌ Error adding shelter: " + (error.response?.data?.message || error.message));
        }
    };

    // Handle script load
    const handleScriptLoad = () => {
        setIsScriptLoaded(true);
    };

    return (
        <div className="sd23456789012">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="mc34567890123">
                <div className="shelter-content-wrapper">
                    <h2 className="pt45678901234">Add Shelter</h2>

                    <form onSubmit={handleSubmit} className="sf56789012345">
                        {/* Google Maps Search Box and Map */}
                        <div className="mp67890123456">
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
                                                className="sc89012345678"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                            />
                                        </Autocomplete>

                                        <GoogleMap
                                            mapContainerStyle={{ width: "100%", height: "400px" }}
                                            zoom={15}
                                            center={{ lat: latitude, lng: longitude }}
                                            onClick={handleMapClick}
                                            onLoad={map => {
                                                mapRef.current = map;
                                            }}
                                        >
                                            {latitude && longitude && <Marker position={{ lat: latitude, lng: longitude }} />}
                                        </GoogleMap>
                                    </>
                                ) : (
                                    <div className="loading-map">
                                        <div className="map-loading-indicator">
                                            <div className="spinner"></div>
                                            <p>Loading map...</p>
                                        </div>
                                    </div>
                                )}
                            </LoadScript>
                        </div>

                        {/* Location Name Field */}
                        <div className="ln90123456789">
                            <label className="ll01234567890">Location Name</label>
                            <input 
                                type="text" 
                                value={location} 
                                placeholder="Location Name" 
                                onChange={(e) => setLocation(e.target.value)} 
                                required 
                                className="lf12345678901"
                            />
                            {errors.location && <p className="le23456789012">{errors.location}</p>}
                        </div>

                        <div className="tc34567890123">
                            <label className="tl45678901234">Total Capacity</label>
                            <input 
                                type="number" 
                                placeholder="Total Capacity" 
                                value={totalCapacity} 
                                onChange={(e) => setTotalCapacity(e.target.value)} 
                                required 
                                min="1"
                                className="tf56789012345"
                            />
                            {errors.totalCapacity && <p className="te67890123456">{errors.totalCapacity}</p>}
                        </div>

                        {/* Contact Details Field */}
                        <div className="cd78901234567">
                            <label className="cl89012345678">Contact Number</label>
                            <input 
                                type="text" 
                                placeholder="10-digit phone number" 
                                value={contactNumber} 
                                onChange={(e) => setContactNumber(e.target.value)} 
                                required 
                                className="cf90123456789"
                            />
                            {errors.contactNumber && <p className="ce01234567890">{errors.contactNumber}</p>}
                        </div>

                        {/* Volunteer Selection Dropdown */}
                        <div className="vs12345678901">
                            <label className="vl23456789012">Assigned Volunteer</label>
                            <select 
                                value={assignedVolunteer} 
                                onChange={(e) => setAssignedVolunteer(e.target.value)} 
                                required
                                className="vf34567890123"
                            >
                                <option value="" disabled>Select Volunteer</option>
                                {volunteers.length > 0 ? (
                                    volunteers.map((volunteer) => (
                                        <option key={volunteer._id} value={volunteer._id}>
                                            {volunteer.userDetails.name || "Unnamed Volunteer"}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No available volunteers</option>
                                )}
                            </select>
                            {errors.assignedVolunteer && <p className="ve45678901234">{errors.assignedVolunteer}</p>}
                        </div>

                        <button 
                            type="submit" 
                            className="sb56789012345"
                        >
                            Add Shelter
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddShelter;
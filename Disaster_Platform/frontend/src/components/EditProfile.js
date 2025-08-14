import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/profile/${user.id}`);
      setFormData(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile." });
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 3) error = "Name must be at least 3 characters";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value)) error = "Invalid phone number (10 digits required)";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (value < 18) error = "Must be 18 or older";
        else if (value > 100) error = "Invalid age";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field on change
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors in the form." });
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/profile/edit/${user.id}`,
        formData
      );
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update profile." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="a1234567890b12">
      <AdminSidebar />
      <main className="b2234567890b12">
        <div className="c3234567890b12-container">
          <h2 className="d4234567890b12-title">Edit Profile</h2>
          
          {message && (
            <div className={`e5234567890b12-message ${message.type === "error" ? "f6234567890b12-error" : "g7234567890b12-success"}`}>
              {message.text}
              <button 
                onClick={() => setMessage(null)} 
                className="h8234567890b12-close-btn"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="i9234567890b12-form">
            <div className={`j0234567890b12-form-group ${errors.name ? "error-field" : ""}`}>
              <label className="k1234567890b12-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={`l2234567890b12-input ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && (
                <span className="error-message" style={{ color: "#ff0000", fontSize: "0.8rem" }}>
                  {errors.name}
                </span>
              )}
            </div>
            
            <div className={`m3234567890b12-form-group ${errors.phone ? "error-field" : ""}`}>
              <label className="n4234567890b12-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className={`o5234567890b12-input ${errors.phone ? "input-error" : ""}`}
                maxLength="10"
              />
              {errors.phone && (
                <span className="error-message" style={{ color: "#ff0000", fontSize: "0.8rem" }}>
                  {errors.phone}
                </span>
              )}
            </div>
            
            <div className={`p6234567890b12-form-group ${errors.address ? "error-field" : ""}`}>
              <label className="q7234567890b12-label">Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className={`r8234567890b12-input ${errors.address ? "input-error" : ""}`}
              />
              {errors.address && (
                <span className="error-message" style={{ color: "#ff0000", fontSize: "0.8rem" }}>
                  {errors.address}
                </span>
              )}
            </div>
            
            <div className={`s9234567890b12-form-group ${errors.age ? "error-field" : ""}`}>
              <label className="t0234567890b12-label">Age</label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                className={`u1234567890b12-input ${errors.age ? "input-error" : ""}`}
                min="18"
                max="100"
              />
              {errors.age && (
                <span className="error-message" style={{ color: "#ff0000", fontSize: "0.8rem" }}>
                  {errors.age}
                </span>
              )}
            </div>
            
            <button 
              type="submit" 
              className="v2234567890b12-submit-btn"
              disabled={loading || Object.values(errors).some(error => error)}
            >
              {loading ? (
                <>
                  <span className="w3234567890b12-spinner"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </main>

    </div>
  );
};

export default EditProfile;
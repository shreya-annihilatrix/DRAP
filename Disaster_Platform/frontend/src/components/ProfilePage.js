import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: ""
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${user.id}`);
      setProfile(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        age: response.data.age || ""
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile." });
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!photo) {
      setMessage({ type: "error", text: "Please select a photo first." });
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("userId", user.id);

    try {
      const response = await axios.put("http://localhost:5000/api/profile/update-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: response.data.message });
      fetchProfile();
    } catch (error) {
      console.error("Error response:", error.response?.data);
      setMessage({ type: "error", text: "Failed to update profile photo." });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/profile/${user.id}`, formData);
      setProfile(response.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  if (!profile) return <div className="a12345678901b2-loading">Loading profile...</div>;

  return (
    <div className="a12345678901b2">
      <AdminSidebar />
      <main className="b22345678901b2-main">
        <div className="c32345678901b2-container">
          <h2 className="d42345678901b2-title">My Profile</h2>
          
          {message && (
            <div className={`e52345678901b2-message ${message.type === "error" ? "f62345678901b2-error" : "g72345678901b2-success"}`}>
              {message.text}
              <button 
                onClick={() => setMessage(null)} 
                className="h82345678901b2-close-btn"
              >
                &times;
              </button>
            </div>
          )}

          <div className="i92345678901b2-profile-card">
            <div className="j02345678901b2-photo-section">
              <div className="k12345678901b2-photo-container">
                {profile.profilePhotoUrl ? (
                  <img 
                    src={profile.profilePhotoUrl} 
                    alt="Profile" 
                    className="l22345678901b2-profile-photo" 
                  />
                ) : (
                  <div className="m32345678901b2-photo-placeholder">
                    <span className="n42345678901b2-initials">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="o52345678901b2-photo-upload">
                <input 
                  type="file" 
                  id="profile-photo" 
                  onChange={handleFileChange} 
                  className="p62345678901b2-file-input"
                  accept="image/*"
                />
                <label htmlFor="profile-photo" className="q72345678901b2-file-label">
                  Choose Photo
                </label>
                <button 
                  onClick={handlePhotoUpload} 
                  className="r82345678901b2-upload-btn"
                  disabled={!photo}
                >
                  Update Photo
                </button>
              </div>
            </div>

            <div className="s92345678901b2-details-section">
              {isEditing ? (
                <div className="t02345678901b2-edit-form">
                  <div className="u12345678901b2-form-group">
                    <label className="v22345678901b2-label">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w32345678901b2-input"
                    />
                  </div>
                  
                  <div className="x42345678901b2-form-group">
                    <label className="y52345678901b2-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="z62345678901b2-input"
                    />
                  </div>
                  
                  <div className="a72345678901b2-form-group">
                    <label className="b82345678901b2-label">Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="c92345678901b2-input"
                    />
                  </div>
                  
                  <div className="d02345678901b2-form-group">
                    <label className="e12345678901b2-label">Address:</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="f22345678901b2-textarea"
                      rows="3"
                    />
                  </div>
                  
                  <div className="g32345678901b2-form-group">
                    <label className="h42345678901b2-label">Age:</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="i52345678901b2-input"
                    />
                  </div>
                  
                  <div className="j62345678901b2-form-actions">
                    <button 
                      onClick={handleEditToggle} 
                      className="k72345678901b2-cancel-btn"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleProfileUpdate} 
                      className="l82345678901b2-save-btn"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="m92345678901b2-profile-details">
                  <div className="n02345678901b2-detail-item">
                    <span className="o12345678901b2-label">Name:</span>
                    <span className="p22345678901b2-value">{profile.name}</span>
                  </div>
{/*                   
                  <div className="q32345678901b2-detail-item">
                    <span className="r42345678901b2-label">Email:</span>
                    <span className="s52345678901b2-value">{profile.email}</span>
                  </div> */}
                  
                  <div className="t62345678901b2-detail-item">
                    <span className="u72345678901b2-label">Phone:</span>
                    <span className="v82345678901b2-value">{profile.phone || "Not provided"}</span>
                  </div>
                  
                  <div className="w92345678901b2-detail-item">
                    <span className="x02345678901b2-label">Address:</span>
                    <span className="y12345678901b2-value">{profile.address || "Not provided"}</span>
                  </div>
                  
                  <div className="z22345678901b2-detail-item">
                    <span className="a32345678901b2-label">Age:</span>
                    <span className="b42345678901b2-value">{profile.age || "Not provided"}</span>
                  </div>
{/*                   
                  <button 
                    onClick={handleEditToggle} 
                    className="c52345678901b2-edit-btn"
                  >
                    Edit Profile
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
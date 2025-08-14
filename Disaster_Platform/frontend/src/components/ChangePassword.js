import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/ChangePassword.css";

const ChangePassword = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({ 
    oldPassword: "", 
    newPassword: "",
    confirmPassword: "" 
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile/change-password",
        { userId: user.id, ...formData }
      );

      setMessage({ type: "success", text: response.data.message });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to change password." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="a123456789012b">
      <AdminSidebar />
      <main className="b223456789012b-main">
        <div className="c323456789012b-container">
          <h2 className="d423456789012b-title">Change Password</h2>
          
          {message && (
            <div className={`e523456789012b-message ${message.type === "error" ? "f623456789012b-error" : "g723456789012b-success"}`}>
              {message.text}
              <button 
                onClick={() => setMessage(null)} 
                className="h823456789012b-close-btn"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="i923456789012b-form">
            <div className="j023456789012b-form-group">
              <label htmlFor="oldPassword" className="k123456789012b-label">Current Password</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
                className="l223456789012b-input"
              />
            </div>
            
            <div className="m323456789012b-form-group">
              <label htmlFor="newPassword" className="n423456789012b-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                minLength="8"
                className="o523456789012b-input"
              />
              <p className="p623456789012b-hint">Password must be at least 8 characters</p>
            </div>
            
            <div className="q723456789012b-form-group">
              <label htmlFor="confirmPassword" className="r823456789012b-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                className="s923456789012b-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="t023456789012b-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="u123456789012b-spinner"></span>
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
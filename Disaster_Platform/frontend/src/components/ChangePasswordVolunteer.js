import React, { useState } from "react";
import axios from "axios";
import "../styles/VolunteerChangePassword.css";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const VolunteerChangePassword = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({ 
    oldPassword: "", 
    newPassword: "",
    confirmPassword: "" 
  });
  const [message, setMessage] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile/change-password",
        { userId: user.id, ...formData }
      );

      setMessage({ type: "success", text: response.data.message });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error response:", error.response?.data);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to change password." 
      });
    }
  };

  return (
    <div className="a12b34567890124">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a12b34567890125">
        <div className="a12b34567890126">
          <h2 className="a12b34567890127">Change Password</h2>
          
          {message && (
            <div className={`a12b34567890128 ${message.type === "error" ? "a12b34567890129" : "a12b34567890130"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="a12b34567890131">
            <div className="a12b34567890132">
              <label className="a12b34567890133">Current Password</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="a12b34567890134"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className="a12b34567890132">
              <label className="a12b34567890133">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="a12b34567890134"
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div className="a12b34567890132">
              <label className="a12b34567890133">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="a12b34567890134"
                placeholder="Confirm new password"
                required
              />
            </div>
            
            <button type="submit" className="a12b34567890135">
              Update Password
            </button>
          </form>
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerChangePassword;
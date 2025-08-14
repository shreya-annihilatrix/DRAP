import React, { useState } from "react";
import axios from "axios";
import "../styles/ChangePasswordPublic.css";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";

const ChangePasswordPublic = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile/change-password",
        { userId: user.id, ...formData }
      );
      setMessage({ type: "success", text: response.data.message });
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to change password." 
      });
    }
  };

  return (
    <div className="a00100000000001">
      <PublicNavbar />
      
      <main className="a00100000000002">
        <div className="a00100000000003">
          <div className="a00100000000004">
            <h2 className="a00100000000005">Change Password</h2>
            
            {message && (
              <div className={`a00100000000006 ${message.type === "error" ? "a00100000000007" : "a00100000000008"}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="a00100000000009">
              <div className="a00100000000010">
                <label htmlFor="oldPassword" className="a00100000000011">Old Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  placeholder="Enter old password"
                  onChange={handleChange}
                  className="a00100000000012"
                  required
                />
              </div>

              <div className="a00100000000013">
                <label htmlFor="newPassword" className="a00100000000014">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  placeholder="Enter new password"
                  onChange={handleChange}
                  className="a00100000000015"
                  required
                />
              </div>

              <button type="submit" className="a00100000000016">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <footer className="k12345678l90">
        <p className="l23456789m01">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChangePasswordPublic;
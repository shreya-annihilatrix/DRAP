import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EditProfilePublic.css";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";

const PublicEditProfile = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${user.id}`);
      setFormData(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile." });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.age) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }
  
    try {
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
    }
  };

  return (
    <div className="a01000000000001">
      <PublicNavbar />
      
      <main className="a01000000000002">
        <div className="a01000000000003">
          <div className="a01000000000004">
            <h2 className="a01000000000005">Edit Profile</h2>
            
            {message && (
              <div className={`a01000000000006 ${message.type === "error" ? "a01000000000007" : "a01000000000008"}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="a01000000000009">
              <div className="a01000000000010">
                <label htmlFor="name" className="a01000000000011">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="a01000000000012"
                  required
                />
              </div>

              <div className="a01000000000010">
                <label htmlFor="phone" className="a01000000000011">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="a01000000000012"
                  required
                />
              </div>

              <div className="a01000000000010">
                <label htmlFor="address" className="a01000000000011">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="a01000000000012"
                  required
                />
              </div>

              <div className="a01000000000010">
                <label htmlFor="age" className="a01000000000011">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="a01000000000012"
                  required
                />
              </div>

              <button type="submit" className="a01000000000013">
                Save Changes
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

export default PublicEditProfile;
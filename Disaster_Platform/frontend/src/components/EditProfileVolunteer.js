import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/VolunteerEditProfile.css";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const VolunteerEditProfile = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
  });
  const [message, setMessage] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

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

  if (!formData.name) return <div className="a1b234567890123">Loading profile...</div>;

  return (
    <div className="a1b234567890124">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a1b234567890125">
        <div className="a1b234567890126">
          <h2 className="a1b234567890127">Edit Profile</h2>
          
          {message && (
            <div className={`a1b234567890128 ${message.type === "error" ? "a1b234567890129" : "a1b234567890130"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="a1b234567890131">
            <div className="a1b234567890132">
              <label className="a1b234567890133">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="a1b234567890134"
                required
              />
            </div>
            
            <div className="a1b234567890132">
              <label className="a1b234567890133">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="a1b234567890134"
                required
              />
            </div>
            
            <div className="a1b234567890132">
              <label className="a1b234567890133">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="a1b234567890134"
                required
              />
            </div>
            
            <div className="a1b234567890132">
              <label className="a1b234567890133">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="a1b234567890134"
                required
              />
            </div>
            
            <button type="submit" className="a1b234567890135">
              Save Changes
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

export default VolunteerEditProfile;
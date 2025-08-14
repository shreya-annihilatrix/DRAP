import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/VolunteerProfile.css";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const VolunteerProfilePage = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
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
      setProfile(response.data);
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

  if (!profile) return <div className="ab1234567890123">Loading profile...</div>;

  return (
    <div className="ab1234567890124">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="ab1234567890125">
        <div className="ab1234567890126">
          <h2 className="ab1234567890127">My Profile</h2>
          
          {message && (
            <div className={`ab1234567890128 ${message.type === "error" ? "ab1234567890129" : "ab1234567890130"}`}>
              {message.text}
            </div>
          )}

          <div className="ab1234567890131">
            <div className="ab1234567890132">
              <div className="ab1234567890133">
                {profile.profilePhotoUrl ? (
                  <img src={profile.profilePhotoUrl} alt="Profile" className="ab1234567890134" />
                ) : (
                  <div className="ab1234567890135">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ab1234567890136">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="ab1234567890137">
                <label htmlFor="file-upload" className="ab1234567890138">
                  Choose Photo
                  <input id="file-upload" type="file" onChange={handleFileChange} className="ab1234567890139" />
                </label>
                <button onClick={handlePhotoUpload} className="ab1234567890140">
                  Update Photo
                </button>
              </div>
            </div>

            <div className="ab1234567890141">
              <div className="ab1234567890142">
                <label className="ab1234567890143">Name</label>
                <div className="ab1234567890144">{profile.name}</div>
              </div>
              
              <div className="ab1234567890142">
                <label className="ab1234567890143">Email</label>
                <div className="ab1234567890144">{profile.email}</div>
              </div>
              
              <div className="ab1234567890142">
                <label className="ab1234567890143">Phone</label>
                <div className="ab1234567890144">{profile.phone || "Not provided"}</div>
              </div>
              
              <div className="ab1234567890142">
                <label className="ab1234567890143">Address</label>
                <div className="ab1234567890144">{profile.address || "Not provided"}</div>
              </div>
              
              <div className="ab1234567890142">
                <label className="ab1234567890143">Age</label>
                <div className="ab1234567890144">{profile.age || "Not provided"}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerProfilePage;
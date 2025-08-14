import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PublicProfilePage.css";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";

const PublicProfilePage = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState(null);

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

  if (!profile) return <p className="ab00000000000001">Loading profile...</p>;

  return (
    <div className="ab00000000000002">
      <PublicNavbar />
      
      <main className="ab00000000000003">
        <div className="ab00000000000004">
          <div className="ab00000000000005">
            <h2 className="ab00000000000006">My Profile</h2>
            
            {message && (
              <div className={`ab00000000000007 ${message.type === "error" ? "ab00000000000008" : "ab00000000000009"}`}>
                {message.text}
              </div>
            )}

            <div className="ab00000000000010">
              <div className="ab00000000000011">
                {profile.profilePhotoUrl ? (
                  <img 
                    src={profile.profilePhotoUrl} 
                    alt="Profile" 
                    className="ab00000000000012" 
                  />
                ) : (
                  <div className="ab00000000000013">
                    <svg className="ab00000000000014" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="ab00000000000015">
                <input 
                  type="file" 
                  id="ab00000000000016" 
                  onChange={handleFileChange} 
                  className="ab00000000000017"
                />
                <label htmlFor="ab00000000000016" className="ab00000000000018">
                  Choose Photo
                </label>
                <button 
                  onClick={handlePhotoUpload} 
                  className="ab00000000000019"
                >
                  Update Photo
                </button>
              </div>
            </div>

            <div className="ab00000000000020">
              <div className="ab00000000000021">
                <span className="ab00000000000022">Name:</span>
                <span className="ab00000000000023">{profile.name}</span>
              </div>
              <div className="ab00000000000024">
                <span className="ab00000000000025">Email:</span>
                <span className="ab00000000000026">{profile.email}</span>
              </div>
              <div className="ab00000000000027">
                <span className="ab00000000000028">Phone:</span>
                <span className="ab00000000000029">{profile.phone || "Not provided"}</span>
              </div>
              <div className="ab00000000000030">
                <span className="ab00000000000031">Address:</span>
                <span className="ab00000000000032">{profile.address || "Not provided"}</span>
              </div>
              <div className="ab00000000000033">
                <span className="ab00000000000034">Age:</span>
                <span className="ab00000000000035">{profile.age || "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="ab00000000000036">
        <p className="ab00000000000037">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicProfilePage;
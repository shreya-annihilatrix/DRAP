import "../styles/VolunteerAccount.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const VolunteerAccountSettings = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(0);

  const settingsCards = [
    {
      title: "My Profile",
      description: "View your personal information and account details",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sv1234567890">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: "/volunteer/profile"
    },
    {
      title: "Edit Profile",
      description: "Update your personal information and preferences",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sv1234567890">
          <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: "/volunteer/edit-profile"
    },
    {
      title: "Change Password",
      description: "Update your account password for better security",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sv1234567890">
          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: "/volunteer/change-password"
    }
  ];

  return (
    <div className="vl1234567890">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="mn1234567890">
        <div className="ct1234567890">
          <h2 className="tt1234567890">Account Settings</h2>
          
          <div className="gd1234567890">
            {settingsCards.map((card, index) => (
              <div key={index} className="cd1234567890" onClick={() => navigate(card.path)}>
                <div className="ic1234567890">
                  {card.icon}
                </div>
                <div className="tx1234567890">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <button className="bt1234567890">
                  Manage
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div> 
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerAccountSettings;
import "../styles/VolunteerResourceUsage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const VolunteerResourceUsage = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(0);
  const [resourceStats, setResourceStats] = useState({
    available: 15,
    allocated: 8,
    consumed: 23
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching resource data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const resourceCards = [
    {
      title: "Add Resource Usage",
      description: "Log new resources being used in relief efforts",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ab45678901">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: resourceStats.available,
      path: "/volunteer/res-usage"
    },
    {
      title: "View Resource Usage",
      description: "Review all resources allocated and their usage status",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ab45678901">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: resourceStats.allocated,
      path: "/volunteer/res-usage-details"
    }
  ];

  return (
    <div className="ab12345678">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="cd23456789">
        <div className="ef34567890">
          <h2 className="gh45678901">Resource Management</h2>
          
          {loading ? (
            <div className="ij56789012">
              <div className="kl67890123"></div>
              <p>Loading resource data...</p>
            </div>
          ) : (
            <div className="mn78901234">
              {resourceCards.map((card, index) => (
                <div key={index} className="op89012345" onClick={() => navigate(card.path)}>
                  <div className="qr90123456">
                    {card.icon}
                  </div>
                  <div className="st01234567">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <button className="uv12345678">
                    Manage
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> 
      </main>
      
      <footer className="wx23456789">
        <p className="yz34567890">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerResourceUsage;
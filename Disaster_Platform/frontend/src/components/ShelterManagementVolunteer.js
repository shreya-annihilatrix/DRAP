import "../styles/VolunteerShelterManagement.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";

const VolunteerShelterManagement = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(0);
  const [shelterStats, setShelterStats] = useState({
    assigned: 5,
    accepted: 3,
    resources: 12
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching shelter data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const shelterCards = [
    {
      title: "Assigned Shelters",
      description: "View and manage shelters assigned to you",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="c2345678901">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: shelterStats.assigned,
      path: "/assigned-shelters"
    },
    {
      title: "Accepted Shelters",
      description: "Manage shelters you've accepted responsibility",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="c2345678901">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: shelterStats.accepted,
      path: "/accepted-shelters"
    },
    {
      title: "Resource Allocation",
      description: "View and manage resources allocated to shelters",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="c2345678901">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: shelterStats.resources,
      path: "/volunteer/view-allocated"
    }
  ];

  return (
    <div className="s3456789012">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="m4567890123">
        <div className="d5678901234">
          <h2 className="t6789012345">Shelter Management</h2>
          {/* <p className="p7890123456">
            Manage disaster relief shelters and allocate resources efficiently to those in need.
          </p> */}
          
          {loading ? (
            <div className="l8901234567">
              <div className="o9012345678"></div>
              <p>Loading shelter data...</p>
            </div>
          ) : (
            <div className="g0123456789">
              {shelterCards.map((card, index) => (
                <div key={index} className="c1234567890" onClick={() => navigate(card.path)}>
                  <div className="i2345678901">
                    {card.icon}
                    {/* <div className="b3456789012">{card.count}</div> */}
                  </div>
                  <div className="t4567890123">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <button className="v5678901234">
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
          
          {/* <div className="q6789012345">
            <h3 className="h7890123456">Recent Activity</h3>
            <div className="a8901234567">
              <div className="e9012345678">
                <div className="r0123456789">
                  <div className="b1234567890"></div>
                </div>
                <div>
                  <h4 className="f2345678901">New shelter assigned</h4>
                  <p className="j3456789012">Riverside Community Center has been assigned to you</p>
                  <span className="t4567890123">10 minutes ago</span>
                </div>
              </div>
              
              <div className="e9012345678">
                <div className="r0123456789">
                  <div className="b1234567890 y5678901234"></div>
                </div>
                <div>
                  <h4 className="f2345678901">Resource allocation updated</h4>
                  <p className="j3456789012">20 new blankets delivered to East Side Shelter</p>
                  <span className="t4567890123">2 hours ago</span>
                </div>
              </div>
              
              <div className="e9012345678">
                <div className="r0123456789">
                  <div className="b1234567890 g6789012345"></div>
                </div>
                <div>
                  <h4 className="f2345678901">Shelter status changed</h4>
                  <p className="j3456789012">Downtown Shelter marked as at capacity</p>
                  <span className="t4567890123">1 day ago</span>
                </div>
              </div>
            </div>
          </div> */}
        </div> 
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerShelterManagement;
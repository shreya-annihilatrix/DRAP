import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/PublicNavbar.css";

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(null);
  
  // Sync activeButton with current route whenever location changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/public-home')) setActiveButton(-1);
    else if (path.includes('/public/increp')) setActiveButton(0);
    else if (path.includes('/public/don')) setActiveButton(1);
    else if (path.includes('/public/cont')) setActiveButton(2);
    else if (path.includes('/public/compl')) setActiveButton(3);
    else if (path.includes('/public/acnt')) setActiveButton(4);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleNavigation = (path, buttonIndex) => {
    setActiveButton(buttonIndex);
    if (path === "-1") {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        navigate(-1); // Go back one page in history
      } else {
        // No history, go to public home
        navigate("/public-home");
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className="a123b4567890">
      <header className="b234c5678901">
        <h1 className="c345d6789012">Public Dashboard</h1>
        <nav className="f678g9012345">
          <ul className="g789h0123456">
            <li className={`h890i1234567 ${activeButton === -1 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("/public-home", -1)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="16" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <span className="l234m5678901">Dashboard</span>
            </li>
            
            <li className={`h890i1234567 ${activeButton === 0 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("/public/increp", 0)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H8C7.46957 4 6.96086 4.21071 6.58579 4.58579C6.21071 4.96086 6 5.46957 6 6V20C6 20.5304 6.21071 21.0391 6.58579 21.4142C6.96086 21.7893 7.46957 22 8 22H16C16.5304 22 17.0391 21.7893 17.4142 21.4142C17.7893 21.0391 18 20.5304 18 20V6C18 5.46957 17.7893 4.96086 17.4142 4.58579C17.0391 4.21071 16.5304 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="l234m5678901">Incident Report</span>
            </li>
            
            <li className={`h890i1234567 ${activeButton === 1 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("/public/don", 1)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 9.5V7.5C17 7.23478 16.8946 6.98043 16.7071 6.79289C16.5196 6.60536 16.2652 6.5 16 6.5H8C7.73478 6.5 7.48043 6.60536 7.29289 6.79289C7.10536 6.98043 7 7.23478 7 7.5V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 13C9 13.7956 9.31607 14.5587 9.87868 15.1213C10.4413 15.6839 11.2044 16 12 16C12.7956 16 13.5587 15.6839 14.1213 15.1213C14.6839 14.5587 15 13.7956 15 13C15 12.2044 14.6839 11.4413 14.1213 10.8787C13.5587 10.3161 12.7956 10 12 10C11.2044 10 10.4413 10.3161 9.87868 10.8787C9.31607 11.4413 9 12.2044 9 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="l234m5678901">Donation</span>
            </li>
            
            <li className={`h890i1234567 ${activeButton === 2 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("/public/cont", 2)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="l234m5678901">Contribution</span>
            </li>
            
            <li className={`h890i1234567 ${activeButton === 3 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("/public/compl", 3)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="l234m5678901">Complaint</span>
            </li>
            
            <li className={`h890i1234567 ${activeButton === 4 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("/public/acnt", 4)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="l234m5678901">Account</span>
            </li>
            
            <li className={`h890i1234567 ${activeButton === 5 ? 'i901j2345678' : ''}`}
                onClick={() => handleNavigation("-1", 5)}>
              <div className="j012k3456789">
                <svg className="k123l4567890" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="l234m5678901">Back</span>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="d456e7890123">
          <span className="e567f8901234">Log out</span>
        </button>
      </header>
    </div>
  );
};

export default PublicNavbar;
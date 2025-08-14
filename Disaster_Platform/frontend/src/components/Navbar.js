import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/VolunteerNavbar.css";

const NavBar = ({ activeButton, setActiveButton }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sync activeButton with current route whenever location changes
  useEffect(() => {
    const path = location.pathname;
    
    // Create a mapping of ALL possible paths to button indexes
    const pathToButtonMap = {
      // Shelter Management paths
      '/volunteer/sm': 0,
      '/assigned-shelters': 0,
      '/accepted-shelters': 0,
      '/volunteer/view-allocated': 0,
      '/add-inmates/:shelterId': 0,

      
      // Task Management paths
      '/volunteer/tasks': 1,
      '/volunteer/tm': 1,
      '/volunteer/accepted-task': 1,
      '/volunteer/completed-tasks': 1,
      
      // Resource Usage paths
      '/volunteer/res-usage': 2,
      '/volunteer/res-usage-details': 2,
      '/volunteer/rum': 2,
      
      // Complaints & Feedback paths
      '/volunteer/cf': 3,
      '/volunteer/feedback-view': 3,
      '/user/complaint': 3,
      '/user/view-complaint': 3,
      
      // Account paths
      '/volunteer/profile': 4,
      '/volunteer/edit-profile': 4,
      '/volunteer/change-password': 4,
      '/volunteer/as': 4,

      
      // Contributions paths
      '/volunteer/verify-contribute': 5,
      // '/volunteer/verify-contributions': 5,
      // '/volunteer/contribution-list': 5
      '-1': 6

    };

    // Find the matching path
    const matchedButton = pathToButtonMap[path] !== undefined ? 
      pathToButtonMap[path] : 
      activeButton; // Keep current active button if no match found

    setActiveButton(matchedButton);
  }, [location.pathname, setActiveButton, activeButton]);


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
        // No history, go to admin home
        navigate("/volunteer-home");
      }
    } else {
      navigate(path);
    }

  };

  return (
    <header className="h2345678901">
      <h1 className="t3456789012">Volunteer Dashboard</h1>
      <nav className="n4567890123">
        <ul className="u5678901234">
          <li className={`l6789012345 ${activeButton === 0 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("/volunteer/sm", 0)}>
            Shelter Management
          </li>

          <li className={`l6789012345 ${activeButton === 1 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("/volunteer/tm", 1)}>
            Task Management
          </li>
          <li className={`l6789012345 ${activeButton === 2 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("/volunteer/rum", 2)}>
            Resource Usage
          </li>
          <li className={`l6789012345 ${activeButton === 3 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("/volunteer/cf", 3)}>
            Complaints & Feedback
          </li>
          <li className={`l6789012345 ${activeButton === 4 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("/volunteer/as", 4)}>
            Account
          </li>
          <li className={`l6789012345 ${activeButton === 5 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("/volunteer/verify-contribute", 5)}>
            Contributions
          </li>
          <li className={`l6789012345 ${activeButton === 6 ? 'a7890123456' : ''}`} 
              onClick={() => handleNavigation("-1", 6)}>
            Back
          </li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="b8901234567">
        <span className="s9012345678">Log out</span>
      </button>
    </header>
  );
};

export default NavBar;
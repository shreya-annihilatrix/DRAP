import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  // Inline CSS for the sidebar
  const styles = {
    sidebarContainer: {
      position: "relative",
      width: "250px",
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #2c3e50, #34495e)",
    },
    sidebarContent: {
      width: "100%",
      padding: "20px",
      boxSizing: "border-box",
      position: "relative", // Ensure content stays above background
      color: "white", // Set default text color
    },
    sidebarTitle: {
      textAlign: "center",
      borderBottom: "2px solid #3498db",
      paddingBottom: "15px",
      marginBottom: "20px",
      color: "#ecf0f1",
      fontSize: "1.5rem",
    },
    sidebarButton: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      background: "rgba(255,255,255,0.1)",
      color: "white", // Explicit white text
      border: "none",
      borderRadius: "5px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "block", // Ensure proper button sizing
    },
    sidebarButtonHover: {
      background: "#3498db",
      transform: "translateX(5px)",
    },
    buttonContainer: {
      width: "100%",
      marginTop: "20px", // Space after last item
    },
    logoutButton: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      background: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    dashboardButton: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      background: "#2ecc71",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }
  };

  const sidebarItems = [
    { label: "Account Settings", path: "/admin/account" },
    { label: "View Complaints", path: "/admin/view-complaint" },
    { label: "Manage Skills", path: "/admin-skills" },
    { label: "Volunteer Management", path: "/admin/volunteer-page" },
    { label: "Shelter Management", path: "/admin/shelter-page" },
    { label: "Task Management", path: "/admin/task-page" },
    { label: "Incident Management", path: "/admin-incident-page" },
    { label: "Resource Management", path: "/admin/resource-page" },
    { label: "Campaign & Donation", path: "/admin/donation-page" },
    { label: "View Contributions", path: "/Admin/view-contribute" },
    { label: "Back", path: -1 },
  ];

  return (
    <div style={styles.sidebarContainer}>
      <div style={styles.sidebarContent}>
        <h2 style={styles.sidebarTitle}>Admin Panel</h2>
        
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...styles.sidebarButton,
              ...(hoveredButton === index ? styles.sidebarButtonHover : {}),
            }}
          >
            {item.label}
          </button>
        ))}
        
        <div style={styles.buttonContainer}>
          <button 
            onClick={() => navigate("/admin-home")} 
            style={styles.dashboardButton}
          >
            Dashboard
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login");
            }} 
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
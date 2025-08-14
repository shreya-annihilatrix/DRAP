import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the path as needed
import "../styles/AdminHome.css"; // If you have additional global styles

const AdminVolunteerPage = () => {
  const navigate = useNavigate();

  // Inline CSS with unique 6-digit class names for the main content and card design
  const styles = {
    container: {
      display: "flex",
      height: "100%",
      fontFamily: "'Roboto', sans-serif",
      background: "#f0f2f5",
    },
    mainContent: {
      flex: 1,
      padding: "30px",
      background: "#ffffff",
      overflowY: "auto",
    },
    pageTitle: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "30px",
      fontSize: "2.2rem",
      fontWeight: "bold",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      justifyContent: "center",
    },
    card: {
      padding: "20px",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      fontSize: "16px",
      textAlign: "center",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      border: "3px solid",
    },
    backButton: {
      background: "#34495e",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.3s ease",
      marginTop: "30px",
    },
  };

  return (
    <div style={styles.container} className="ABC123">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main style={styles.mainContent} className="GHI789">
        <h2 style={styles.pageTitle} className="JKL012">Volunteer Management</h2>
        <div style={styles.cardGrid} className="MNO345">
          <div
            style={{
              ...styles.card,
              background: "#e8f5e9",
              borderColor: "#43a047",
              color: "#2e7d32",
            }}
            className="PQR678"
            onClick={() => navigate("/admin-approval")}
          >
            <h3>Volunteer Approvals</h3>
          </div>
          <div
            style={{
              ...styles.card,
              background: "#e3f2fd",
              borderColor: "#1e88e5",
              color: "#1e88e5",
            }}
            className="PQR678"
            onClick={() => navigate("/volunteer-accepted")}
          >
            <h3>Accepted Volunteers</h3>
          </div>
          <div
            style={{
              ...styles.card,
              background: "#ffebee",
              borderColor: "#e53935",
              color: "#c62828",
            }}
            className="PQR678"
            onClick={() => navigate("/volunteer-rejected")}
          >
            <h3>Rejected Volunteers</h3>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          {/* <button
            onClick={() => navigate("/admin-home")}
            style={styles.backButton}
            className="STU901"
          >
            Back
          </button> */}
        </div>
      </main>
    </div>
  );
};

export default AdminVolunteerPage;

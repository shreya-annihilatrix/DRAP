import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust path as needed
import "../styles/VolunteerAccepted.css"; // If you have additional global styles

const VolunteerAccepted = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/accepted-volunteers");
      setVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching accepted volunteers:", error);
    }
  };

  // Inline CSS with unique 7-character class names
  const styles = {
    container: {
      display: "flex",
      background: "#f4f4f4",
      height: "100%",
      fontFamily: "'Roboto', sans-serif",
    },
    mainContent: {
      flex: 1,
      padding: "30px",
      background: "#ffffff",
      overflowY: "auto",
      textAlign: "center",
    },
    pageTitle: {
      fontSize: "28px",
      marginBottom: "20px",
      color: "#2c3e50",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    },
    tableHeader: {
      background: "linear-gradient(to right, #3498db, #2980b9)",
      color: "white",
    },
    tableCell: {
      padding: "10px",
      border: "1px solid #ddd",
      textAlign: "center",
    },
    backButton: {
      background: "#34495e",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.3s ease",
      marginBottom: "20px",
    },
  };

  return (
    <div style={styles.container} className="A1B2C3D">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main style={styles.mainContent} className="E4F5G6H">

        <h2 style={styles.pageTitle} className="M0N1O2P">
          Accepted Volunteers
        </h2>
        {volunteers.length === 0 ? (
          <p className="Q3R4S5T">No accepted volunteers found.</p>
        ) : (
          <table style={styles.table} className="U6V7W8X">
            <thead style={styles.tableHeader} className="Y9Z0A1B">
              <tr>
                <th style={styles.tableCell} className="C2D3E4F">Name</th>
                <th style={styles.tableCell} className="G5H6I7J">Email</th>
                <th style={styles.tableCell} className="K8L9M0N">Phone</th>
                <th style={styles.tableCell} className="O1P2Q3R">Skills</th>
              </tr>
            </thead>
            <tbody className="S4T5U6V">
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id} className="W7X8Y9Z">
                  <td style={styles.tableCell} className="A1B2C3E">
                    {volunteer.userId?.name || "N/A"}
                  </td>
                  <td style={styles.tableCell} className="D4E5F6G">
                    {volunteer.userId?.email || "N/A"}
                  </td>
                  <td style={styles.tableCell} className="H7I8J9K">
                    {volunteer.userId?.phone || "N/A"}
                  </td>
                  <td style={styles.tableCell} className="L0M1N2O">
                    {volunteer.skills.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
                <button
          onClick={() => navigate("/admin-home")}
          style={styles.backButton}
          className="I7J8K9L"
        >
          &larr; Back to Home
        </button>
      </main>
    </div>
  );
};

export default VolunteerAccepted;

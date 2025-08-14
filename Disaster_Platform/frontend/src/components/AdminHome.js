import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="xhtr-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <button onClick={() => navigate("/admin/account")}>Account Settings</button>
        <button onClick={() => navigate("/admin/view-complaint")}>View Complaints</button>
        <button onClick={handleLogout} className="nvsh-logout-btn">Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="pbqr-title">Admin Dashboard</h2>
        <div className="fmzk-card-grid">
          <div className="yqtr-card blue" onClick={() => navigate("/admin-skills")}>
            <h3>Manage Skills</h3>
          </div>
          <div className="yqtr-card green" onClick={() => navigate("/admin/volunteer-page")}>
            <h3>Volunteer Management</h3>
          </div>
          <div className="yqtr-card red" onClick={() => navigate("/admin/shelter-page")}>
            <h3>Shelter Management</h3>
          </div>
          <div className="yqtr-card purple" onClick={() => navigate("/admin/task-page")}>
            <h3>Task Management</h3>
          </div>
          <div className="yqtr-card orange" onClick={() => navigate("/admin-incident-page")}>
            <h3>Incident Management</h3>
          </div>
          <div className="yqtr-card teal" onClick={() => navigate("/admin/resource-page")}>
            <h3>Resource Management</h3>
          </div>
          <div className="yqtr-card pink" onClick={() => navigate("/admin/donation-page")}>
            <h3>Campaign & Donation Management</h3>
          </div>
          <div className="yqtr-card yellow" onClick={() => navigate("/Admin/view-contribute")}>
            <h3>View Public Contributions</h3>
          </div>
        </div>
      </div>

      <style>{`
        /* Main container */
        .xhtr-container {
          display: flex;
          background: #f4f4f4;
          color: #333;
          height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          width: 250px;
          background: #2c2c3e;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          color: white;
        }

        .sidebar button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.3s;
        }

        .sidebar button:hover {
          background: #357ac9;
        }

        /* Main content */
        .main-content {
          flex: 1;
          padding: 30px;
          text-align: center;
        }

        .pbqr-title {
          font-size: 28px;
          margin-bottom: 20px;
        }

        /* Grid layout */
        .fmzk-card-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          justify-content: center;
        }

        /* Cards */
        .yqtr-card {
          padding: 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 16px;
          text-align: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid;
        }

        /* Color themes */
        .blue { background: #e3f2fd; border-color: #1e88e5; color: #1e88e5; }
        .green { background: #e8f5e9; border-color: #43a047; color: #2e7d32; }
        .red { background: #ffebee; border-color: #e53935; color: #c62828; }
        .purple { background: #f3e5f5; border-color: #8e24aa; color: #6a1b9a; }
        .orange { background: #fff3e0; border-color: #fb8c00; color: #e65100; }
        .teal { background: #e0f2f1; border-color: #00897b; color: #00695c; }
        .pink { background: #fce4ec; border-color: #d81b60; color: #ad1457; }
        .yellow { background: #fffde7; border-color: #fdd835; color: #f57f17; }

        /* Card hover effect */
        .yqtr-card:hover {
          transform: scale(1.05);
          box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
        }

        /* Logout button */
        .nvsh-logout-btn {
          background: #ff4d4d;
          padding: 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 16px;
          color: white;
        }

        .nvsh-logout-btn:hover {
          background: #cc0000;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .fmzk-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .xhtr-container {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            text-align: center;
          }
          .fmzk-card-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminHome;

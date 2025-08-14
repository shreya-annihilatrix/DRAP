import "../styles/AdminHome.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminIncidentPage.css"
import AdminSidebar from "./AdminSidebar"; // Adjust the import path as needed

const AdminIncidentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="A1234567Z">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="B1234567N">
        <h2 className="C1234567L">Incident Details</h2>
        <div className="D1234567M">
          <div 
            className="E1234567Q blue" 
            onClick={() => navigate("/admin-incident-page/admin-report-incident")}
          >
            <h3 className="F1234567X">Add Verified Incident</h3>
          </div>
          <div 
            className="G1234567R green" 
            onClick={() => navigate("/admin-incident-page/verify-public")}
          >
            <h3 className="H1234567Y">Verify Incident Reports</h3>
          </div>
          <div 
            className="I1234567S blue" 
            onClick={() => navigate("/admin-incident-page/ongoing-incident")}
          >
            <h3 className="J1234567W">Ongoing Incidents</h3>
          </div>
          <div 
            className="K1234567T red" 
            onClick={() => navigate("/admin-incident-page/completed-incident")}
          >
            <h3 className="L1234567V">Completed Incidents</h3>
          </div>
          <div 
            className="M1234567U green" 
            onClick={() => navigate("/admin/incident-reports")}
          >
            <h3 className="O1234567P">View Incident Reports</h3>
          </div>
        </div>
        {/* <button 
          onClick={() => navigate("/admin-home")} 
          className="P1234567Q"
        >
          Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminIncidentPage;
import "../styles/AdminHome.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the import path as needed
import "../styles/AdminResourceManagement.css"

const AdminResourcePage = () => {
  const navigate = useNavigate();

  return (
    <div className="A1B2345Z">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="C1D2345N">
        <h2 className="E1F2345L">Resource Management</h2>
        <div className="G1H2345M">
          <div 
            className="I1J2345Q blue" 
            onClick={() => navigate("/admin/resource-type")}
          >
            <h3 className="K1L2345X">Manage Resource Type</h3>
          </div>
          <div 
            className="M1N2345R green" 
            onClick={() => navigate("/admin/view-allocated")}
          >
            <h3 className="O1P2345Y">View Allocated Resources</h3>
          </div>
          <div 
            className="Q1R2345S red" 
            onClick={() => navigate("/admin/res-usage-details")}
          >
            <h3 className="T1U2345W">View Resource Usage Report</h3>
          </div>
        </div>
        {/* <button 
          onClick={() => navigate("/admin-home")} 
          className="V1W2345Q"
        >
          Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminResourcePage;
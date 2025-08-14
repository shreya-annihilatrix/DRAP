import "../styles/AdminHome.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminDonationManagement.css"

 // Adjust the import path as needed

const AdminDonationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="A12345678Z">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="B12345678N">
        <h2 className="C12345678L">Campaign & Donation Management</h2>
        <div className="D12345678M">
          <div 
            className="E12345678Q blue" 
            onClick={() => navigate("/admin/campaign-page")}
          >
            <h3 className="F12345678X">Add Campaign</h3>
          </div>
          <div 
            className="G12345678R green" 
            onClick={() => navigate("/admin/donation-view")}
          >
            <h3 className="H12345678Y">View Donations</h3>
          </div>
          <div 
            className="I12345678S blue" 
            onClick={() => navigate("/admin/donation-alloc")}
          >
            <h3 className="J12345678W">Allocate Donations</h3>
          </div>
          <div 
            className="K12345678T red" 
            onClick={() => navigate("/admin/donation-report")}
          >
            <h3 className="L12345678V">View Donation Usage Report</h3>
          </div>
        </div>
        {/* <button 
          onClick={() => navigate("/admin-home")} 
          className="M12345678Q"
        >
          Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminDonationPage;
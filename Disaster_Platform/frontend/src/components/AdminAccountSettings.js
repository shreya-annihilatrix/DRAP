import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the path as needed
import "../styles/AdminAccountPage.css";

const AdminAccountPage = () => {
  const navigate = useNavigate();

  return (
    <div className="X9Y8Z7">
      <AdminSidebar />
      <div className="W6V5U4">
        <h2 className="T3S2R1">Account Settings</h2>
        <div className="G1H2I3">
          <div className="M4N5O6" onClick={() => navigate("/profile")}>
            <h3 className="P7Q8R9">My Profile</h3>
          </div>
          <div className="M4N5O6" onClick={() => navigate("/edit-profile")}>
            <h3 className="P7Q8R9">Edit Profile</h3>
          </div>
          <div className="M4N5O6" onClick={() => navigate("/change-password")}>
            <h3 className="P7Q8R9">Change Password</h3>
          </div>
        </div>
        {/* <button onClick={() => navigate("/admin-home")} className="K4J3I2">
          Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminAccountPage;

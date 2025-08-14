import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the import path as needed
import "../styles/AdminShelterPage.css";

const AdminShelterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="X1Y2Z3A">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="B4C5D6E">
        <h2 className="F7G8H9I">Shelter Management</h2>
        <div className="J0K1L2M">
          <div
            className="N3O4P5Q blue"
            onClick={() => navigate("/admin/add-shelter")}
          >
            <h3 className="O6P7Q8R">Add Shelter</h3>
          </div>
          <div
            className="N3O4P5Q green"
            onClick={() => navigate("/admin/view-shelter-admin")}
          >
            <h3 className="O6P7Q8R">View Shelter</h3>
          </div>
          <div
            className="N3O4P5Q red"
            onClick={() => navigate("/admin/resource-allocation")}
          >
            <h3 className="O6P7Q8R">Allocate Resources Shelter</h3>
          </div>
        </div>
        {/* <button
          onClick={() => navigate("/admin-home")}
          className="R6S7T8U"
        >
          Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminShelterPage;

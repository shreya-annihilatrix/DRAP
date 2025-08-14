import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the import path as needed
import "../styles/AdminTaskPage.css";

const AdminTaskPage = () => {
  const navigate = useNavigate();

  return (
    <div className="A1B2C3D4">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="E5F6G7H8">
        <h2 className="I9J0K1L2">Task Management</h2>
        <div className="M3N4O5P6">
          <div
            className="Q7R8S9T0 blue"
            onClick={() => navigate("/admin/task-type")}
          >
            <h3 className="U1V2W3X4">Manage Task Type</h3>
          </div>
          <div
            className="Q7R8S9T0 green"
            onClick={() => navigate("/admin/task-management")}
          >
            <h3 className="U1V2W3X4">Assign Task</h3>
          </div>
          <div
            className="Q7R8S9T0 blue"
            onClick={() => navigate("/admin/tasks")}
          >
            <h3 className="U1V2W3X4">View Assigned Tasks</h3>
          </div>
          <div
            className="Q7R8S9T0 red"
            onClick={() => navigate("/admin/completed-tasks")}
          >
            <h3 className="U1V2W3X4">Verify Completed Tasks</h3>
          </div>
          <div
            className="Q7R8S9T0 green"
            onClick={() => navigate("/admin/progress-reports")}
          >
            <h3 className="U1V2W3X4">Task Progress Reports</h3>
          </div>
        </div>
        {/* <button onClick={() => navigate("/admin-home")} className="Y5Z6A7B8">
          Back
        </button> */}
      </div>
    </div>
  );
};

export default AdminTaskPage;

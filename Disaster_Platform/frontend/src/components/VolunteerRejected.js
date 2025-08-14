import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the path as needed
import "../styles/VolunteerRejected.css"; // Import the external CSS file

const VolunteerRejected = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/rejected-volunteers");
      setVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching rejected volunteers:", error);
    }
  };

  const handleDelete = async (volunteerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-volunteer/${volunteerId}`);
      setVolunteers(volunteers.filter((vol) => vol._id !== volunteerId));
      alert("Volunteer deleted successfully!");
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      alert("Error deleting volunteer.");
    }
  };

  return (
    <div className="A123456">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="B234567">
        <h2 className="C345678">Rejected Volunteers</h2>
        {volunteers.length === 0 ? (
          <p className="D456789">No rejected volunteers found.</p>
        ) : (
          <table className="E567890">
            <thead className="F678901">
              <tr>
                <th className="G789012">Name</th>
                <th className="H890123">Email</th>
                <th className="I901234">Phone</th>
                <th className="J012345">Skills</th>
                <th className="K123456">Action</th>
              </tr>
            </thead>
            <tbody className="L234567">
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id} className="M345678">
                  <td className="N456789">{volunteer.userId?.name || "N/A"}</td>
                  <td className="O567890">{volunteer.userId?.email || "N/A"}</td>
                  <td className="P678901">{volunteer.userId?.phone || "N/A"}</td>
                  <td className="Q789012">{volunteer.skills.join(", ")}</td>
                  <td className="R890123">
                    <button onClick={() => handleDelete(volunteer._id)} className="S901234">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={() => navigate("/admin-home")} className="T012345">
          &larr; Back to Home
        </button>
      </main>
    </div>
  );
};

export default VolunteerRejected;

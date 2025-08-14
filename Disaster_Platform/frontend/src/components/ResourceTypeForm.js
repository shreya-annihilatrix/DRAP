import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../styles/ResourceTypeForm.css";

const ResourceTypeForm = () => {
  const [form, setForm] = useState({ name: "" });
  const [resourceTypes, setResourceTypes] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResourceTypes();
  }, []);

  const fetchResourceTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resourceTypes/list");
      setResourceTypes(response.data);
    } catch (error) {
      console.error("Error fetching resource types:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ text: "⚠️ Please enter a resource type.", type: "danger" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/resourceTypes/add", { name: form.name });
      setMessage({ text: "✅ Resource Type added successfully!", type: "success" });
      setForm({ name: "" });
      fetchResourceTypes();
    } catch (error) {
      console.error(error);
      setMessage({ text: "❌ Error adding resource type.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resourceTypes/delete/${id}`);
      setMessage({ text: "🗑️ Resource Type deleted successfully!", type: "success" });
      fetchResourceTypes();
    } catch (error) {
      console.error("Error deleting resource type:", error);
      setMessage({ text: "❌ Error deleting resource type.", type: "danger" });
    }
  };

  return (
    <div className="a1b2345678901">
      <AdminSidebar />
      <main className="a1b2345678902">
        <div className="a1b2345678903">
          <h2 className="a1b2345678904">📦 Manage Resource Types</h2>

          {message.text && (
            <div className={`a1b2345678905 ${message.type === "success" ? "a1b2345678906" : "a1b2345678907"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="a1b2345678908">
            <input
              type="text"
              value={form.name}
              placeholder="Enter resource type"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="a1b2345678909"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="a1b2345678910"
            >
              {loading ? "Adding..." : "➕ Add Resource"}
            </button>
          </form>

          <h3 className="a1b2345678911">📋 Existing Resource Types</h3>
          {resourceTypes.length > 0 ? (
            <div className="a1b2345678912">
              {resourceTypes.map((resource) => (
                <div key={resource._id} className="a1b2345678913">
                  <span>{resource.name}</span>
                  <button 
                    className="a1b2345678914" 
                    onClick={() => handleDelete(resource._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="a1b2345678915">No resource types added yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResourceTypeForm;
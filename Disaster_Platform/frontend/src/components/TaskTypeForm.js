import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // You'll need to create this component
import "../styles/TaskTypeForm.css";

const TaskTypeForm = () => {
  const [form, setForm] = useState({ name: "" });
  const [taskTypes, setTaskTypes] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  const fetchTaskTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/list");
      setTaskTypes(response.data);
    } catch (error) {
      console.error("Error fetching task types:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ text: "⚠️ Please enter a task type.", type: "danger" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/tasks/insert", { name: form.name });
      setMessage({ text: "✅ Task Type added successfully!", type: "success" });
      setForm({ name: "" });
      fetchTaskTypes();
    } catch (error) {
      console.error(error);
      setMessage({ text: "❌ Error adding task type.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${id}`);
      setMessage({ text: "🗑️ Task Type deleted successfully!", type: "success" });
      fetchTaskTypes();
    } catch (error) {
      console.error("Error deleting task type:", error);
      setMessage({ text: "❌ Error deleting task type.", type: "danger" });
    }
  };

  return (
    <div className="a123b45678901">
      <AdminSidebar />
      <main className="a234b56789012">
        <div className="a345b67890123">
          <h2 className="a456b78901234">📦 Manage Task Types</h2>

          {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

          <form onSubmit={handleSubmit} className="a567b89012345">
            <input
              type="text"
              value={form.name}
              placeholder="Enter task type"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "➕ Add Task"}
            </button>
          </form>

          <h3 className="a678b90123456">📋 Existing Task Types</h3>
          {taskTypes.length > 0 ? (
            <div className="a789b01234567">
              {taskTypes.map((task) => (
                <div key={task._id} className="a890b12345678">
                  <span>#{task.typeId} - {task.name}</span>
                  <button className="a901b23456789" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="a012b34567890">No task types added yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskTypeForm;
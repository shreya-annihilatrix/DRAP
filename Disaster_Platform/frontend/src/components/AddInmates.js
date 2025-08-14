import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import "../styles/AddInmates.css";

const AddInmates = () => {
  const { shelterId } = useParams();
  const navigate = useNavigate();
  const [inmates, setInmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(1); // Assuming this is the second tab in navbar
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    age: "",
    contact: ""
  });

  const fetchInmates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/inmates/shelters/${shelterId}/inmates`
      );
      setInmates(response.data);
    } catch (error) {
      console.error("Error fetching inmates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInmates();
  }, [shelterId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddInmate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/inmates/shelters/${shelterId}/inmates`,
        formData
      );
      setFormData({ name: "", place: "", age: "", contact: "" });
      fetchInmates();
      
      // Toast notification instead of alert
      const toast = document.createElement("div");
      toast.className = "a1234b567890123";
      toast.textContent = "Inmate added successfully!";
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add("a1234b567890124");
        setTimeout(() => document.body.removeChild(toast), 500);
      }, 3000);
      
    } catch (error) {
      console.error("Error adding inmate:", error);
      alert("Error adding inmate");
    }
  };

  const handleDeleteInmate = async (inmateId) => {
    if (!window.confirm("Are you sure you want to delete this inmate?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/inmates/shelters/${inmateId}`);
      
      // Toast notification instead of alert
      const toast = document.createElement("div");
      toast.className = "a1234b567890125";
      toast.textContent = "Inmate deleted successfully!";
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add("a1234b567890124");
        setTimeout(() => document.body.removeChild(toast), 500);
      }, 3000);
      
      fetchInmates();
    } catch (error) {
      console.error("Error deleting inmate:", error);
      alert("Error deleting inmate");
    }
  };

  if (loading && inmates.length === 0) {
    return (
      <div className="a1234b567890126">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a1234b567890127">
          <div className="a1234b567890128"></div>
        </div>
        <footer className="f7890123456">
          <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="a1234b567890126">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a1234b567890129">
        <div className="a1234b567890130">
          <div className="a1234b567890131">
            {/* <button 
              onClick={() => navigate(-1)} 
              className="a1234b567890132"
            >
              <svg className="a1234b567890133" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Shelters
            </button> */}
            
            <h1 className="a1234b567890134">
              <span className="a1234b567890135">Manage</span>
              <span className="a1234b567890136">Inmates</span>
            </h1>
          </div>
          
          <div className="a1234b567890137">
            <div className="a1234b567890138">
              <h2 className="a1234b567890139">Add New Inmate</h2>
              <form onSubmit={handleAddInmate} className="a1234b567890140">
                <div className="a1234b567890141">
                  <label className="a1234b567890142">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="a1234b567890143" 
                    required 
                  />
                </div>
                
                <div className="a1234b567890141">
                  <label className="a1234b567890142">Place</label>
                  <input 
                    type="text" 
                    name="place" 
                    value={formData.place} 
                    onChange={handleChange} 
                    className="a1234b567890143" 
                    required 
                  />
                </div>
                
                <div className="a1234b567890141">
                  <label className="a1234b567890142">Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    className="a1234b567890143" 
                    required 
                  />
                </div>
                
                <div className="a1234b567890141">
                  <label className="a1234b567890142">Contact</label>
                  <input 
                    type="text" 
                    name="contact" 
                    value={formData.contact} 
                    onChange={handleChange} 
                    className="a1234b567890143" 
                    required 
                  />
                </div>
                
                <button type="submit" className="a1234b567890144">
                  <svg className="a1234b567890145" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Inmate
                </button>
              </form>
            </div>
            
            <div className="a1234b567890146">
              <h2 className="a1234b567890147">Inmate List</h2>
              
              {inmates.length === 0 ? (
                <div className="a1234b567890148">
                  <svg className="a1234b567890149" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <p className="a1234b567890150">No inmates added yet.</p>
                </div>
              ) : (
                <div className="a1234b567890151">
                  <table className="a1234b567890152">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Place</th>
                        <th>Age</th>
                        <th>Contact</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inmates.map((inmate) => (
                        <tr key={inmate._id}>
                          <td>{inmate.name}</td>
                          <td>{inmate.place}</td>
                          <td>{inmate.age}</td>
                          <td>{inmate.contact}</td>
                          <td>
                            <button 
                              onClick={() => handleDeleteInmate(inmate._id)}
                              className="a1234b567890153"
                            >
                              <svg className="a1234b567890154" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddInmates;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Adjust the path as needed

const AdminAddSkill = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Enhanced styles with modern design and animations
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      background: "#f8f9fa",
    },
    mainContent: {
      flex: 1,
      padding: "30px",
      background: "#ffffff",
      overflowY: "auto",
      borderRadius: "15px",
      margin: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      position: "relative",
    },
    pageTitle: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "40px",
      fontSize: "2.4rem",
      fontWeight: "600",
      position: "relative",
      paddingBottom: "15px",
    },
    pageTitleAfter: {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "4px",
      background: "linear-gradient(to right, #3498db, #8e44ad)",
      borderRadius: "2px",
    },
    inputContainer: {
      marginBottom: "40px",
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      maxWidth: "800px",
      margin: "0 auto 40px auto",
    },
    input: {
      padding: "15px",
      width: "350px",
      borderRadius: "12px",
      border: "2px solid #e0e0e0",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#6c5ce7",
      boxShadow: "0 4px 15px rgba(108, 92, 231, 0.2)",
    },
    addButton: {
      padding: "15px 28px",
      background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "1.05rem",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(108, 92, 231, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    addButtonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(108, 92, 231, 0.4)",
    },
    table: {
      width: "100%",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      borderCollapse: "separate",
      borderSpacing: "0",
    },
    tableHeader: {
      background: "linear-gradient(to right, #6c5ce7, #a29bfe)",
      color: "white",
    },
    tableHeaderCell: {
      padding: "20px",
      fontSize: "1.1rem",
      fontWeight: "600",
      textAlign: "left",
    },
    tableCell: {
      padding: "18px 20px",
      borderBottom: "1px solid #f1f1f1",
    },
    actionsCell: {
      padding: "18px 20px",
      borderBottom: "1px solid #f1f1f1",
      width: "280px",
      textAlign: "right",
    },
    tableRow: {
      transition: "all 0.2s ease",
    },
    tableRowHover: {
      backgroundColor: "#f8f9ff",
    },
    editInput: {
      width: "100%",
      padding: "12px 15px",
      border: "2px solid #6c5ce7",
      borderRadius: "10px",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
    },
    actionButton: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "0.95rem",
      fontWeight: "600",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      minWidth: "110px",
      justifyContent: "center",
    },
    editButton: {
      background: "linear-gradient(45deg, #3949AB, #5E35B1)",
      color: "white",
    },
    editButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(93, 64, 177, 0.3)",
    },
    saveButton: {
      background: "linear-gradient(45deg, #20bf6b, #0fb9b1)",
      color: "white",
      padding: "12px 22px",
      minWidth: "150px",
    },
    saveButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(32, 191, 107, 0.25)",
    },
    deleteButton: {
      background: "linear-gradient(45deg, #D32F2F, #F44336)",
      color: "white",
    },
    deleteButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(244, 67, 54, 0.25)",
    },
    skillName: {
      fontSize: "1.05rem",
      color: "#2d3436",
      fontWeight: "500",
    },
    noSkills: {
      textAlign: "center",
      padding: "30px",
      color: "#a0a0a0",
      fontSize: "1.1rem",
    },
    alertContainer: {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "16px 25px",
      borderRadius: "12px",
      color: "white",
      fontWeight: "500",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      zIndex: 1000,
      animation: "slideIn 0.3s ease forwards",
      maxWidth: "400px",
    },
    successAlert: {
      background: "linear-gradient(45deg, #20bf6b, #0fb9b1)",
    },
    errorAlert: {
      background: "linear-gradient(45deg, #D32F2F, #F44336)",
    },
    warningAlert: {
      background: "linear-gradient(45deg, #F57C00, #FFB74D)",
    },
    alertIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    '@keyframes slideIn': {
      from: {
        transform: 'translateX(100%)',
        opacity: 0,
      },
      to: {
        transform: 'translateX(0)',
        opacity: 1,
      },
    },
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    // Auto-hide alert after 3 seconds
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/skills");
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
      showAlert("Error fetching skills: " + error.message, "error");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      showAlert("Skill name cannot be empty", "warning");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:5000/api/skills", { name: newSkill.trim() });
      setSkills([...skills, response.data]);
      setNewSkill("");
      showAlert(`Skill "${newSkill.trim()}" added successfully!`, "success");
    } catch (error) {
      console.error("Error adding skill:", error);
      showAlert("Error adding skill: " + (error.response?.data?.error || error.message), "error");
    }
  };

  const handleUpdateSkill = async (id) => {
    if (!updatedName.trim()) {
      showAlert("Skill name cannot be empty", "warning");
      return;
    }
    
    try {
      const response = await axios.put(`http://localhost:5000/api/skills/${id}`, { name: updatedName.trim() });
      setSkills(skills.map((skill) => (skill._id === id ? response.data : skill)));
      setEditingSkill(null);
      showAlert(`Skill updated to "${updatedName.trim()}" successfully!`, "success");
    } catch (error) {
      console.error("Error updating skill:", error);
      showAlert("Error updating skill: " + (error.response?.data?.error || error.message), "error");
    }
  };

  const handleDeleteSkill = async (id) => {
    // Add confirmation dialog
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const skillToDelete = skills.find(skill => skill._id === id);
        await axios.delete(`http://localhost:5000/api/skills/${id}`);
        setSkills(skills.filter((skill) => skill._id !== id));
        showAlert(`Skill "${skillToDelete.name}" deleted successfully!`, "success");
      } catch (error) {
        console.error("Error deleting skill:", error);
        showAlert("Error deleting skill: " + (error.response?.data?.error || error.message), "error");
      }
    }
  };

  // Custom alert component
  const Alert = () => {
    if (!alert.show) return null;
    
    let alertStyle = {...styles.alertContainer};
    let icon = null;
    
    if (alert.type === "success") {
      alertStyle = {...alertStyle, ...styles.successAlert};
      icon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    } else if (alert.type === "error") {
      alertStyle = {...alertStyle, ...styles.errorAlert};
      icon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      );
    } else if (alert.type === "warning") {
      alertStyle = {...alertStyle, ...styles.warningAlert};
      icon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      );
    }
    
    return (
      <div style={alertStyle}>
        <span style={styles.alertIcon}>{icon}</span>
        <span>{alert.message}</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Custom Alert Component */}
      <Alert />
      
      {/* Sidebar imported as separate component */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main style={styles.mainContent}>
        <h2 style={styles.pageTitle}>
          Manage Skills
          <div style={styles.pageTitleAfter}></div>
        </h2>
        
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter Skill Name"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.border.split(' ')[2];
              e.target.style.boxShadow = styles.input.boxShadow;
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddSkill();
            }}
          />
          <button 
            onClick={handleAddSkill} 
            style={styles.addButton}
            onMouseEnter={(e) => {
              e.target.style.transform = styles.addButtonHover.transform;
              e.target.style.boxShadow = styles.addButtonHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = styles.addButton.boxShadow;
            }}
          >
            <span>Add Skill</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {skills.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Skill</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr 
                  key={skill._id} 
                  style={styles.tableRow}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                  }}
                >
                  <td style={styles.tableCell}>
                    {editingSkill === skill._id ? (
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        style={styles.editInput}
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleUpdateSkill(skill._id);
                        }}
                      />
                    ) : (
                      <span style={styles.skillName}>{skill.name}</span>
                    )}
                  </td>
                  <td style={styles.actionsCell}>
                    {editingSkill === skill._id ? (
                      <div style={styles.buttonContainer}>
                        <button
                          onClick={() => handleUpdateSkill(skill._id)}
                          style={styles.saveButton}
                          onMouseEnter={(e) => {
                            e.target.style.transform = styles.saveButtonHover.transform;
                            e.target.style.boxShadow = styles.saveButtonHover.boxShadow;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = styles.actionButton.boxShadow;
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <div style={styles.buttonContainer}>
                        <button
                          onClick={() => {
                            setEditingSkill(skill._id);
                            setUpdatedName(skill.name);
                          }}
                          style={{...styles.actionButton, ...styles.editButton}}
                          onMouseEnter={(e) => {
                            e.target.style.transform = styles.editButtonHover.transform;
                            e.target.style.boxShadow = styles.editButtonHover.boxShadow;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = styles.actionButton.boxShadow;
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill._id)}
                          style={{...styles.actionButton, ...styles.deleteButton}}
                          onMouseEnter={(e) => {
                            e.target.style.transform = styles.deleteButtonHover.transform;
                            e.target.style.boxShadow = styles.deleteButtonHover.boxShadow;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = styles.actionButton.boxShadow;
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.noSkills}>
            No skills found. Add your first skill above!
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAddSkill;
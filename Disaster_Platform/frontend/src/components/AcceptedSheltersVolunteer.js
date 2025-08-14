import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import "../styles/AcceptedShelterVolunteer.css";

const AcceptedShelters = () => {
  const { user } = useUser();
  const [shelters, setShelters] = useState([]);
  const navigate = useNavigate();
  const [volunteerId, setVolunteerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(1);

  useEffect(() => {
    const fetchVolunteerId = async () => {
      if (!user || !user.id) {
        console.error("User ID missing. Please log in again.");
        return;
      }
  
      try {
        setLoading(true);
        // First get the volunteer ID
        const volunteerResponse = await axios.get(
          `http://localhost:5000/api/shelters/volunteer-id/${user.id}`
        );
        const fetchedVolunteerId = volunteerResponse.data.volunteerId;
        setVolunteerId(fetchedVolunteerId);
  
        if (fetchedVolunteerId) {
          // Then get the accepted shelters with taskStatus included
          const sheltersResponse = await axios.get(
            `http://localhost:5000/api/shelters/accepted/${fetchedVolunteerId}`
          );
          console.log("Shelters response:", sheltersResponse.data); // Debug log
          setShelters(sheltersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVolunteerId();
  }, [user]);

  const handleMarkCompletion = async (shelterId) => {
    if (!volunteerId) {
      console.error("Volunteer ID is missing.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/shelters/update-task/${shelterId}/${volunteerId}`,
        { taskStatus: 4 }
      );
      alert("Task marked as completed successfully!");
      
      // Update local state
      setShelters(shelters.map(shelter =>
        shelter._id === shelterId ? { ...shelter, taskStatus: 4 } : shelter
      ));
    } catch (error) {
      console.error("Error marking task as completed:", error);
      alert("Failed to mark task as completed. Please try again.");
    }
  };

  if (loading) return (
    <div className="a123b4567890123">
      <div className="a123b4567890124"></div>
    </div>
  );

  return (
    <div className="a123b4567890125">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a123b4567890126">
        <div className="a123b4567890127">
          <h2 className="a123b4567890128">
            <span className="a123b4567890129">Accepted</span>
            <span className="a123b4567890130">Shelters</span>
          </h2>
          
          {shelters.length === 0 ? (
            <div className="a123b4567890131">
              <div className="a123b4567890132">
                <svg className="a123b4567890133" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 className="a123b4567890134">No Shelters Accepted Yet</h3>
                <p className="a123b4567890135">Your accepted shelter assignments will appear here</p>
              </div>
            </div>
          ) : (
            <div className="a123b4567890136">
              {shelters.map((shelter) => (
                <div key={shelter._id} className="a123b4567890137">
                  <div className="a123b4567890138">
                    <div className="a123b4567890139">
                      <svg className="a123b4567890140" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <h3 className="a123b4567890141">{shelter.location}</h3>
                    </div>
                    
                    <div className="a123b4567890142">
                      <div className="a123b4567890143">
                        <svg className="a123b4567890144" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <span>{shelter.contactDetails}</span>
                      </div>
                      
                      <div className="a123b4567890143">
                        <svg className="a123b4567890144" viewBox="0 0 24 24">
                          <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        <span>Capacity: {shelter.totalCapacity}</span>
                      </div>
                      
                      <div className="a123b4567890143">
                        <svg className="a123b4567890144" viewBox="0 0 24 24">
                          <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        <span>Current Inmates: {shelter.inmates}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="a123b4567890145">
                    {shelter.taskStatus === 4 ? (
                      <div className="a123b4567890150">
                        <svg className="a123b4567890151" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <span>Marked as Completed</span>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate(`/add-inmates/${shelter._id}`)}
                          className="a123b4567890146"
                        >
                          <svg className="a123b4567890147" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                          </svg>
                          Add/Delete Inmates
                        </button>
                        <button 
                          onClick={() => handleMarkCompletion(shelter._id)}
                          className="a123b4567890148"
                        >
                          <svg className="a123b4567890149" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                          Mark Completion
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AcceptedShelters;
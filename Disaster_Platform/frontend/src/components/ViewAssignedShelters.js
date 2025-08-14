import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import "../styles/ViewAssignedShelters.css";

const ViewAssignedShelters = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [shelters, setShelters] = useState([]);
    const [volunteerId, setVolunteerId] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [activeButton, setActiveButton] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteerIdAndShelters = async () => {
            if (!user || !user.id) {
                console.error("User ID missing. Please log in again.");
                return;
            }

            try {
                setLoading(true);
                const volunteerResponse = await axios.get(`http://localhost:5000/api/shelters/volunteer-id/${user.id}`);
                const fetchedVolunteerId = volunteerResponse.data.volunteerId;
                setVolunteerId(fetchedVolunteerId);

                if (fetchedVolunteerId) {
                    const response = await axios.get(`http://localhost:5000/api/shelters/assigned-shelters/${fetchedVolunteerId}`);
                    // Combine shelter data with taskStatus from the response
                    const sheltersWithStatus = response.data.shelters.map(shelter => ({
                        ...shelter,
                        taskStatus: response.data.taskStatus || 1 // Default to 1 if status is missing
                    }));
                    setShelters(sheltersWithStatus);
                    setTaskStatus(response.data.taskStatus);
                }
            } catch (error) {
                console.error("Error fetching volunteer ID or assigned shelters:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteerIdAndShelters();
    }, [user]);

    const handleTaskAction = async (shelterId, status) => {
        if (!volunteerId) {
            console.error("Volunteer ID is missing.");
            return;
        }
    
        try {
            await axios.put(`http://localhost:5000/api/shelters/update-task/${shelterId}/${volunteerId}`, { taskStatus: status });
            
            if (status === 2) {
                alert("Task accepted successfully!");
            } else if (status === 3) {
                alert("Task rejected successfully!");
            } else if (status === 4) {
                alert("Task marked as verified!");
            }
            
            // Update the task status for all shelters since it's shared
            setShelters(shelters.map(shelter => ({
                ...shelter,
                taskStatus: status
            })));
            setTaskStatus(status);
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status. Please try again.");
        }
    };

    const renderTaskActions = (shelter) => {
        // Use the taskStatus from the shelter object (which now includes it)
        const status = shelter.taskStatus || 1; // Default to 1 if missing
        
        switch(status) {
            case 1: // Waiting for approval
                return (
                    <div className="a12b34567890138">
                        <button 
                            onClick={() => handleTaskAction(shelter._id, 2)} 
                            className="a12b34567890139"
                        >
                            <svg className="a12b34567890157" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            Accept Task
                        </button>
                        <button 
                            onClick={() => handleTaskAction(shelter._id, 3)} 
                            className="a12b34567890140"
                        >
                            <svg className="a12b34567890158" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                            </svg>
                            Reject Task
                        </button>
                    </div>
                );
            case 2: // Accepted
                return (
                    <div className="a12b34567890141">
                        <svg className="a12b34567890159" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Task Accepted
                    </div>
                );
            case 3: // Rejected
                return (
                    <div className="a12b34567890142">
                        <svg className="a12b34567890160" viewBox="0 0 24 24">
                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                        </svg>
                        Task Rejected
                    </div>
                );
            case 4: // Verified
                return (
                    <div className="a12b34567890143">
                        <svg className="a12b34567890161" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                        </svg>
                        Marked as Verified
                    </div>
                );
            default:
                return <p>No action required</p>;
        }
    };

    if (loading) return (
        <div className="a12b34567890123">
            <div className="a12b34567890144"></div>
        </div>
    );

    return (
        <div className="a12b34567890124">
            <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
            
            <main className="a12b34567890125">
                <div className="a12b34567890126">
                    <h2 className="a12b34567890127">
                        <span className="a12b34567890145">My Assigned</span>
                        <span className="a12b34567890146">Shelters</span>
                    </h2>
                    
                    {shelters.length === 0 ? (
                        <div className="a12b34567890128">
                            <div className="a12b34567890147">
                                <h3 className="a12b34567890149">No Shelters Assigned Yet</h3>
                                <p className="a12b34567890150">You'll see your assigned shelters here when they become available</p>
                            </div>
                        </div>
                    ) : (
                        <div className="a12b34567890130">
                            {shelters.map((shelter) => (
                                <div key={shelter._id} className="a12b34567890131">
                                    <div className="a12b34567890151">
                                        <div className="a12b34567890152">
                                            <svg className="a12b34567890153" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            <h3 className="a12b34567890133">{shelter.location}</h3>
                                        </div>
                                        <div className="a12b34567890134">
                                            <div className="a12b34567890154">
                                                <svg className="a12b34567890155" viewBox="0 0 24 24">
                                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                                </svg>
                                                <span>{shelter.contactDetails}</span>
                                            </div>
                                            <div className="a12b34567890154">
                                                <svg className="a12b34567890155" viewBox="0 0 24 24">
                                                    <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                                </svg>
                                                <span>Capacity: {shelter.totalCapacity}</span>
                                            </div>
                                            <div className="a12b34567890154">
                                                <svg className="a12b34567890155" viewBox="0 0 24 24">
                                                    <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                                </svg>
                                                <span>Current Inmates: {shelter.inmates}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="a12b34567890136">
                                        <button 
                                            onClick={() => window.open(`https://maps.google.com/?q=${shelter.latitude},${shelter.longitude}`, "_blank")}
                                            className="a12b34567890137"
                                        >
                                            <svg className="a12b34567890156" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            View on Map
                                        </button>

                                        {renderTaskActions(shelter)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            <footer className="f123o4567">
                <p className="p123r4567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ViewAssignedShelters;
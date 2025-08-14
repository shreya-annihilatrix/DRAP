import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import "../styles/ViewAllocatedResourcesVolunteer.css";

const ViewAllocatedResourcesVolunteer = () => {
  const { user } = useUser();
  const [shelter, setShelter] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState(2); // Assuming this is the third tab in navbar

  useEffect(() => {
    if (user) {
      fetchShelter(user.id);
    }
  }, [user]);

  const fetchShelter = async (volunteerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/resourceTypes/shelter-assigned/${volunteerId}`
      );
      if (response.data) {
        setShelter(response.data);
        console.log(response.data);
        fetchAllocations(response.data._id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching shelter:", err);
      setLoading(false);
    }
  };

  const fetchAllocations = async (shelterId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/resourceTypes/allocations/${shelterId}`
      );
      setAllocations(response.data);
    } catch (err) {
      console.error("Error fetching allocations:", err);
      setError("Failed to load allocations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateTotalAmount = (resources) => {
    return resources
      .reduce((sum, resource) => sum + resource.totalAmount, 0)
      .toFixed(2);
  };

  return (
    <div className="a12345b67890123">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />

      <main className="a12345b67890124">
        <div className="a12345b67890125">
          <h2 className="a12345b67890126">
            <span className="a12345b67890127">Allocated</span>
            <span className="a12345b67890128">Resources</span>
          </h2>

          {error && <div className="a12345b67890129">{error}</div>}

          {loading ? (
            <div className="a12345b67890130">
              <div className="a12345b67890131"></div>
              <p className="a12345b67890132">Loading resources...</p>
            </div>
          ) : shelter ? (
            <>
              <div className="a12345b67890133">
                <svg className="a12345b67890134" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 className="a12345b67890135">{shelter.location}</h3>
              </div>

              {allocations.length > 0 ? (
                <div className="a12345b67890136">
                  {allocations.map((allocation) => (
                    <div key={allocation._id} className="a12345b67890137">
                      <div className="a12345b67890138">
                        <svg className="a12345b67890139" viewBox="0 0 24 24">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <h4 className="a12345b67890140">
                          Allocation Date: {formatDate(allocation.allocatedAt)}
                        </h4>
                      </div>
                      
                      <div className="a12345b67890141">
                        <div className="a12345b67890142">
                          <table className="a12345b67890143">
                            <thead className="a12345b67890144">
                              <tr>
                                <th>Resource</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Amount (₹)</th>
                                <th className="a12345b67890145">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allocation.resources.map((resource, index) => (
                                <tr key={index} className="a12345b67890146">
                                  <td className="a12345b67890147">{resource.resourceType.name}</td>
                                  <td className="a12345b67890148">{resource.quantity}</td>
                                  <td className="a12345b67890149">{resource.unit}</td>
                                  <td className="a12345b67890150">₹{resource.totalAmount.toFixed(2)}</td>
                                  <td className="a12345b67890151">{resource.description || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="a12345b67890152">
                          <div className="a12345b67890153">
                            <span className="a12345b67890154">Total Amount:</span>
                            <span className="a12345b67890155">
                              ₹{calculateTotalAmount(allocation.resources)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="a12345b67890156">
                  <svg className="a12345b67890157" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12zM8 13h8v-2H8v2zm0 4h4v-2H8v2zm0-8h8V7H8v2z"/>
                  </svg>
                  <p className="a12345b67890158">No allocations found for your shelter.</p>
                </div>
              )}
            </>
          ) : (
            <div className="a12345b67890159">
              <svg className="a12345b67890160" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <p className="a12345b67890161">No shelter has been assigned to you.</p>
              <p className="a12345b67890162">Please contact your administrator for shelter assignment.</p>
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

export default ViewAllocatedResourcesVolunteer;
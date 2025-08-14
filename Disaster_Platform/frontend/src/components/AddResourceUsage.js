import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import "../styles/AddResourceUsage.css"

const AddResourceUsage = () => {
  const { user } = useUser();
  const [assignedShelter, setAssignedShelter] = useState(null);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [resources, setResources] = useState([
    { resourceType: "", unit: "", quantity: "", description: "" }
  ]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [activeButton, setActiveButton] = useState(3); // Adjust based on your NavBar

  const availableUnits = [
    "kg", "g", "liters", "ml", "pieces", "boxes", "packs", "bottles", 
    "cartons", "cans", "pairs", "rolls", "sets", "units"
  ];

  useEffect(() => {
    if (user) {
      fetchUserAssignedShelter();
      fetchResourceTypes();
    }
  }, [user]);

  const fetchUserAssignedShelter = async () => {
    setFetchingUserData(true);
    try {
      const volunteerResponse = await axios.get(
        `http://localhost:5000/api/resourceTypes/user/${user.id}`
      );
      
      if (!volunteerResponse.data) {
        setError("No volunteer record found for this user.");
        setFetchingUserData(false);
        return;
      }
      
      const volunteerId = volunteerResponse.data._id;
      
      const shelterResponse = await axios.get(
        `http://localhost:5000/api/resourceTypes/volunteer/${volunteerId}`
      );
      
      if (shelterResponse.data && shelterResponse.data.length > 0) {
        setAssignedShelter(shelterResponse.data[0]);
      } else {
        setAssignedShelter(null);
      }
    } catch (err) {
      console.error("Error fetching assigned shelter:", err);
      setError("Failed to load your assigned shelter information.");
    } finally {
      setFetchingUserData(false);
    }
  };

  const fetchResourceTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resourceTypes/list");
      if (response.data && Array.isArray(response.data)) {
        setResourceTypes(response.data);
      } else {
        setError("Failed to load resource types.");
      }
    } catch (err) {
      console.error("Error fetching resource types:", err);
      setError("Failed to load resource types.");
    }
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...resources];
    updatedResources[index][field] = value;
    setResources(updatedResources);
  };

  const addResourceField = () => {
    setResources([...resources, { resourceType: "", unit: "", quantity: "", description: "" }]);
  };

  const removeResourceField = (index) => {
    if (resources.length > 1) {
      const updatedResources = [...resources];
      updatedResources.splice(index, 1);
      setResources(updatedResources);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedShelter || resources.some(r => !r.resourceType || !r.quantity || !r.unit)) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post(
        "http://localhost:5000/api/resourceTypes/add-usage", 
        {
          shelter: assignedShelter._id,
          resources,
          notes,
          userId: user.id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      alert("Usage Details Entered Successfully");
      setSuccess(true);
      setNotes("");
      setResources([{ resourceType: "", unit: "", quantity: "", description: "" }]);
    } catch (err) {
      console.error("Error recording resource usage:", err);
      setError("Failed to record resource usage. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="a1234567890b123">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
        <div className="a1234567890b124">
          <h2 className="a1234567890b125">Resource Usage Entry</h2>
          <p className="a1234567890b126">Please log in to record resource usage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="a1234567890b123">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a1234567890b127">
        <div className="a1234567890b128">
          <h2 className="a1234567890b125">Resource Usage Entry</h2>
          
          {error && <div className="a1234567890b129">{error}</div>}
          {success && <div className="a1234567890b130">Resource usage recorded successfully!</div>}
          
          <form onSubmit={handleSubmit} className="a1234567890b131">
            <div className="a1234567890b132">
              <h3 className="a1234567890b133">Your Assigned Shelter</h3>
              {fetchingUserData ? (
                <div className="a1234567890b134">Loading your assigned shelter...</div>
              ) : assignedShelter ? (
                <div className="a1234567890b135">
                  <div className="a1234567890b136">
                    <svg className="a1234567890b137" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>{assignedShelter.location}</span>
                  </div>
                  <div className="a1234567890b136">
                    <svg className="a1234567890b137" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span>Capacity: {assignedShelter.inmates}/{assignedShelter.totalCapacity}</span>
                  </div>
                  <div className="a1234567890b136">
                    <svg className="a1234567890b137" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                    <span>{assignedShelter.contactDetails}</span>
                  </div>
                </div>
              ) : (
                <div className="a1234567890b138">
                  <svg className="a1234567890b139" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <p>You don't have any shelter assigned to you.</p>
                </div>
              )}
            </div>

            {assignedShelter && (
              <>
                <div className="a1234567890b132">
                  <h3 className="a1234567890b133">Resources Used</h3>
                  {resources.map((resource, index) => (
                    <div key={index} className="a1234567890b140">
                      <div className="a1234567890b141">
                        <div className="a1234567890b142">
                          <label className="a1234567890b143">Resource Type</label>
                          <select 
                            value={resource.resourceType} 
                            onChange={(e) => handleResourceChange(index, "resourceType", e.target.value)}
                            className="a1234567890b144"
                            required
                          >
                            <option value="">-- Select Resource --</option>
                            {resourceTypes.map((r) => (
                              <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="a1234567890b142">
                          <label className="a1234567890b143">Unit</label>
                          <select
                            value={resource.unit}
                            onChange={(e) => handleResourceChange(index, "unit", e.target.value)}
                            className="a1234567890b144"
                            required
                          >
                            <option value="">-- Select Unit --</option>
                            {availableUnits.map((unit, i) => (
                              <option key={i} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>

                        <div className="a1234567890b142">
                          <label className="a1234567890b143">Quantity</label>
                          <input 
                            type="number" 
                            placeholder="Enter quantity" 
                            value={resource.quantity} 
                            onChange={(e) => handleResourceChange(index, "quantity", e.target.value)}
                            className="a1234567890b144"
                            required
                          />
                        </div>
                      </div>

                      <div className="a1234567890b145">
                        <div className="a1234567890b146">
                          <label className="a1234567890b143">Description</label>
                          <textarea
                            placeholder="Additional details (optional)"
                            value={resource.description}
                            onChange={(e) => handleResourceChange(index, "description", e.target.value)}
                            className="a1234567890b147"
                            rows={2}
                          />
                        </div>
                        {resources.length > 1 && (
                          <button 
                            type="button" 
                            className="a1234567890b148" 
                            onClick={() => removeResourceField(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="a1234567890b149" 
                    onClick={addResourceField}
                  >
                    <svg className="a1234567890b150" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add Resource
                  </button>
                </div>

                <div className="a1234567890b132">
                  <h3 className="a1234567890b133">Additional Notes</h3>
                  <div className="a1234567890b151">
                    <textarea
                      placeholder="Any additional notes about this resource usage"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="a1234567890b152"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="a1234567890b153">
                  <button 
                    type="submit" 
                    className="a1234567890b154" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="a1234567890b155" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="a1234567890b156" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        Add Usage
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
      
      <footer className="f7890123456">
        <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddResourceUsage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/AddContributedResource.css";

const AddContributedResource = () => {
  const { user } = useUser();
  const [shelters, setShelters] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState("");
  const [resources, setResources] = useState([
    { resourceType: "", unit: "", quantity: "", description: "" }
  ]);
  const [contributorName, setContributorName] = useState("");
  const [contributorContact, setContributorContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Define available units as an array
  const availableUnits = [
    "kg", "g", "liters", "ml", "pieces", "boxes", "packs", "bottles", 
    "cartons", "cans", "pairs", "rolls", "sets", "units"
  ];

  useEffect(() => {
    fetchShelters();
    fetchResourceTypes();
    
    // Pre-fill contributor information if user is logged in
    if (user) {
      setContributorName(user.name || "");
      setContributorContact(user.phone || "");
    }
  }, [user]);

  const fetchShelters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resourceTypes/shelters");
      setShelters(response.data);
    } catch (err) {
      console.error("Error fetching shelters:", err);
      setError("Failed to load shelters.");
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
    if (!selectedShelter || !contributorName || !contributorContact || resources.some(r => !r.resourceType || !r.quantity || !r.unit)) {
      setError("Please fill in all required fields.");
      setSuccess(false);
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    // Check which ID field exists on the user object
    const userId = user ? (user._id || user.id) : null;
    
    try {
      const response = await axios.post("http://localhost:5000/api/resourceTypes/add-contribution", {
        shelter: selectedShelter,
        resources,
        contributorName,
        contributorContact,
        contributorId: userId,
      });
      
      console.log("Response from server:", response.data);
      setSuccess(true);
      setSelectedShelter("");
      setContributorName(user ? user.name || "" : "");
      setContributorContact(user ? user.phone || "" : "");
      setResources([{ resourceType: "", unit: "", quantity: "", description: "" }]);
    } catch (err) {
      console.error("Error contributing resources:", err);
      setError("Failed to contribute resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="a00000100000000">
      <PublicNavbar />
      
      <div className="a00000100000001">
        <div className="a00000100000002">
          <h1 className="a00000100000003">Contribute Resources</h1>
          <p className="a00000100000004">
            Help those in need by donating essential items to disaster relief shelters
          </p>
          
          {error && (
            <div className="a00000100000005">
              <svg className="a00000100000006" viewBox="0 0 24 24">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="a00000100000007">
              <svg className="a00000100000008" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p>Resources contributed successfully! Thank you for your generosity.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="a00000100000009">
            <div className="a00000100000010">
              <h2 className="a00000100000011">
                <span className="a00000100000012">1</span>
                Contributor Information
              </h2>
              <div className="a00000100000013">
                <div className="a00000100000014">
                  <label htmlFor="contributorName" className="a00000100000015">Contributor Name:</label>
                  <input 
                    type="text" 
                    id="contributorName"
                    className="a00000100000016"
                    value={contributorName} 
                    onChange={(e) => setContributorName(e.target.value)} 
                    placeholder="Enter full name"
                    required 
                  />
                </div>
                <div className="a00000100000014">
                  <label htmlFor="contributorContact" className="a00000100000015">Contact Info:</label>
                  <input 
                    type="text" 
                    id="contributorContact"
                    className="a00000100000016"
                    value={contributorContact} 
                    onChange={(e) => setContributorContact(e.target.value)} 
                    placeholder="Phone number"
                    required 
                  />
                </div>
              </div>
              {!user && (
                <p className="a00000100000017">
                  <svg className="a00000100000018" viewBox="0 0 24 24">
                    <path d="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10,-4.48 10,-10S17.52,2 12,2zM12,17c-0.55,0 -1,-0.45 -1,-1v-4c0,-0.55 0.45,-1 1,-1s1,0.45 1,1v4c0,0.55 -0.45,1 -1,1zM13,9h-2L11,7h2v2z"/>
                  </svg>
                  Sign in to track your contributions and receive updates
                </p>
              )}
            </div>

            <div className="a00000100000010">
              <h2 className="a00000100000011">
                <span className="a00000100000012">2</span>
                Select Shelter
              </h2>
              <div className="a00000100000014">
                <label htmlFor="shelterSelect" className="a00000100000015">Shelter Location:</label>
                <select 
                  id="shelterSelect"
                  className="a00000100000016"
                  value={selectedShelter} 
                  onChange={(e) => setSelectedShelter(e.target.value)} 
                  required
                >
                  <option value="">-- Select Shelter --</option>
                  {shelters.map((shelter) => (
                    <option key={shelter._id} value={shelter._id}>{shelter.location}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="a00000100000010">
              <h2 className="a00000100000011">
                <span className="a00000100000012">3</span>
                Resources to Donate
              </h2>
              {resources.map((resource, index) => (
                <div key={index} className="a00000100000019">
                  <div className="a00000100000020">
                    <span className="a00000100000021">Item {index + 1}</span>
                    {resources.length > 1 && (
                      <button 
                        type="button" 
                        className="a00000100000022" 
                        onClick={() => removeResourceField(index)}
                      >
                        <svg className="a00000100000023" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="a00000100000024">
                    <div className="a00000100000014">
                      <label className="a00000100000015">Resource Type:</label>
                      <select 
                        className="a00000100000016"
                        value={resource.resourceType} 
                        onChange={(e) => handleResourceChange(index, "resourceType", e.target.value)}
                        required
                      >
                        <option value="">-- Select Resource --</option>
                        {resourceTypes.map((r) => (
                          <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="a00000100000025">
                      <div className="a00000100000014">
                        <label className="a00000100000015">Quantity:</label>
                        <input 
                          type="number" 
                          className="a00000100000016"
                          placeholder="Amount" 
                          value={resource.quantity} 
                          onChange={(e) => handleResourceChange(index, "quantity", e.target.value)}
                          required
                        />
                      </div>

                      <div className="a00000100000014">
                        <label className="a00000100000015">Unit:</label>
                        <select
                          className="a00000100000016"
                          value={resource.unit}
                          onChange={(e) => handleResourceChange(index, "unit", e.target.value)}
                          required
                        >
                          <option value="">-- Select Unit --</option>
                          {availableUnits.map((unit, i) => (
                            <option key={i} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="a00000100000014">
                      <label className="a00000100000015">Description:</label>
                      <textarea
                        className="a00000100000026"
                        placeholder="Additional details (optional)"
                        value={resource.description}
                        onChange={(e) => handleResourceChange(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className="a00000100000027" 
                onClick={addResourceField}
              >
                <svg className="a00000100000028" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add Another Resource
              </button>
            </div>

            <div className="a00000100000029">
              <button 
                type="submit" 
                className="a00000100000030" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="a00000100000031"></div>
                    Submitting...
                  </>
                ) : "Submit Contribution"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddContributedResource;
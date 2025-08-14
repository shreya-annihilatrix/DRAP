import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import "../styles/ViewResourceUsage.css";

const ViewResourceUsage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [selectedShelterId, setSelectedShelterId] = useState("");
  const [usageRecords, setUsageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    resourceType: ""
  });
  const [resourceTypes, setResourceTypes] = useState([]);
  const [activeButton, setActiveButton] = useState(4); // Assuming resource usage is button 4
  
  // Update base URLs to match your actual endpoints
  const resourceTypesBaseUrl = "http://localhost:5000/api/resourceTypes";
  const volunteersBaseUrl = "http://localhost:5000/api/resourceTypes";

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }
    // Fetch initial data when component mounts
    fetchInitialData();
  }, [user, navigate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // First, check if the user is a volunteer
      const volunteerRes = await axios.get(`${volunteersBaseUrl}/user/${user.id}`);
      
      let sheltersList = [];
      
      if (volunteerRes.data && volunteerRes.data._id) {
        // User is a volunteer, get assigned shelters
        const sheltersRes = await axios.get(`${volunteersBaseUrl}/volunteer/${volunteerRes.data._id}`);
        sheltersList = sheltersRes.data;
      } else {
        // If not found as volunteer, try to find as shelter owner
        const ownerSheltersRes = await axios.get(`${resourceTypesBaseUrl}/shelters/owner/${user.id}`);
        if (ownerSheltersRes.data) {
          // Handle if API returns single shelter or array
          sheltersList = Array.isArray(ownerSheltersRes.data) 
            ? ownerSheltersRes.data 
            : [ownerSheltersRes.data];
        }
      }
      
      setShelters(sheltersList);
      
      // Set the first shelter as selected by default if available
      if (sheltersList.length > 0) {
        setSelectedShelterId(sheltersList[0]._id);
        await fetchUsageRecords(sheltersList[0]._id);
      }
      
      // Get resource types list
      const typesRes = await axios.get(`${resourceTypesBaseUrl}/list`);
      setResourceTypes(typesRes.data);
      
      if (sheltersList.length === 0) {
        setError("No shelters found for your account.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUsageRecords = async (shelterId) => {
    try {
      setLoading(true);
      const usageRes = await axios.get(`${resourceTypesBaseUrl}/usage/${shelterId}`);
      setUsageRecords(usageRes.data);
      setError("");
    } catch (err) {
      console.error("Error fetching usage records:", err);
      setError("Failed to load usage records.");
      setUsageRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle shelter selection change
  const handleShelterChange = async (e) => {
    const shelterId = e.target.value;
    setSelectedShelterId(shelterId);
    if (shelterId) {
      await fetchUsageRecords(shelterId);
      // Reset filters when changing shelter
      setFilters({ startDate: "", endDate: "", resourceType: "" });
    } else {
      setUsageRecords([]);
    }
  };

  // Format date for display
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Handle filter form changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply selected filters
  const applyFilters = async () => {
    if (!selectedShelterId) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.resourceType) params.append("resourceType", filters.resourceType);
      
      const response = await axios.get(`${resourceTypesBaseUrl}/usage/${selectedShelterId}?${params}`);
      setUsageRecords(response.data);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to filter records.");
    } finally {
      setLoading(false);
    }
  };

  // Reset filters to default
  const resetFilters = async () => {
    setFilters({ startDate: "", endDate: "", resourceType: "" });
    if (selectedShelterId) {
      await fetchUsageRecords(selectedShelterId);
    }
  };

  // Group usage records by date
  const groupUsageByDate = () => {
    const grouped = {};
    usageRecords.forEach(record => {
      // Use createdAt field instead of usedAt to match your schema
      const date = new Date(record.createdAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(record);
    });
    return grouped;
  };

  const groupedUsage = groupUsageByDate();
  
  // Find the currently selected shelter object
  const selectedShelter = shelters.find(shelter => shelter._id === selectedShelterId);

  if (loading && shelters.length === 0) return (
    <div className="a12345678901b00">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      <div className="a12345678901b01">
        <div className="a12345678901b02"></div>
        <p>Loading resource data...</p>
      </div>
    </div>
  );
  
  if (error && shelters.length === 0) return (
    <div className="a12345678901b00">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      <div className="a12345678901b03">{error}</div>
    </div>
  );
  
  if (shelters.length === 0) return (
    <div className="a12345678901b00">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      <div className="a12345678901b03">No shelters found for your account.</div>
      <footer className="f7890123456">
  <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
</footer>
    </div>
  
  );

  return (
    <div className="a12345678901b00">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a12345678901b04">
        <div className="a12345678901b05">
          <h2 className="a12345678901b06">Resource Usage Records</h2>
          
          {shelters.length > 1 && (
            <div className="a12345678901b07">
              <label htmlFor="shelter-select" className="a12345678901b08">Select Shelter:</label>
              <select 
                id="shelter-select" 
                value={selectedShelterId} 
                onChange={handleShelterChange}
                className="a12345678901b09"
              >
                <option value="">-- Select a Shelter --</option>
                {shelters.map(shelter => (
                  <option key={shelter._id} value={shelter._id}>
                    {shelter.location}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedShelter && (
            <div className="a12345678901b10">
              <h3 className="a12345678901b11">Shelter: {selectedShelter.location}</h3>
              <div className="a12345678901b12">
                <div className="a12345678901b13">
                  <span className="a12345678901b14">Capacity:</span>
                  <span className="a12345678901b15">{selectedShelter.inmates}/{selectedShelter.totalCapacity}</span>
                </div>
                <div className="a12345678901b13">
                  <span className="a12345678901b14">Contact:</span>
                  <span className="a12345678901b15">{selectedShelter.contactDetails}</span>
                </div>
              </div>
            </div>
          )}

          <div className="a12345678901b16">
            <h4 className="a12345678901b17">Filter Records</h4>
            <div className="a12345678901b18">
              <div className="a12345678901b19">
                <label className="a12345678901b20">Start Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={filters.startDate} 
                  onChange={handleFilterChange}
                  className="a12345678901b21"
                />
              </div>
              
              <div className="a12345678901b19">
                <label className="a12345678901b20">End Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={filters.endDate} 
                  onChange={handleFilterChange}
                  className="a12345678901b21"
                />
              </div>
              
              <div className="a12345678901b19">
                <label className="a12345678901b20">Resource Type:</label>
                <select 
                  name="resourceType" 
                  value={filters.resourceType} 
                  onChange={handleFilterChange}
                  className="a12345678901b21"
                >
                  <option value="">All Resources</option>
                  {resourceTypes.map(type => (
                    <option key={type._id} value={type._id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="a12345678901b22">
                <button onClick={applyFilters} className="a12345678901b23">Apply Filters</button>
                <button onClick={resetFilters} className="a12345678901b24">Reset</button>
              </div>
            </div>
          </div>

          {loading && <div className="a12345678901b25">
            <div className="a12345678901b26"></div>
            <p>Loading records...</p>
          </div>}
          
          {!loading && Object.keys(groupedUsage).length > 0 ? (
            <div className="a12345678901b27">
              {Object.entries(groupedUsage).map(([date, records]) => (
                <div key={date} className="a12345678901b28">
                  <div className="a12345678901b29">
                    <h4 className="a12345678901b30">Date: {date}</h4>
                  </div>
                  
                  {records.map((record) => (
                    <div key={record._id} className="a12345678901b31">
                      <div className="a12345678901b32">
                        <h5 className="a12345678901b33">Recorded: {formatDate(record.createdAt)}</h5>
                        <span className="a12345678901b34">By: {record.volunteer?.name || "Unknown"}</span>
                      </div>
                      
                      <div className="a12345678901b35">
                        <table className="a12345678901b36">
                          <thead className="a12345678901b37">
                            <tr>
                              <th className="a12345678901b38">Resource</th>
                              <th className="a12345678901b38">Quantity</th>
                              <th className="a12345678901b38">Unit</th>
                              <th className="a12345678901b38">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record.resources.map((resource, index) => (
                              <tr key={index} className={index % 2 === 0 ? "a12345678901b39" : "a12345678901b40"}>
                                <td className="a12345678901b41">{resource.resourceType?.name || "Unknown"}</td>
                                <td className="a12345678901b41">{resource.quantity}</td>
                                <td className="a12345678901b41">{resource.unit}</td>
                                <td className="a12345678901b41">{resource.description || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {record.notes && (
                        <div className="a12345678901b42">
                          <strong>Notes:</strong> {record.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="a12345678901b43">
                <svg className="a12345678901b44" viewBox="0 0 24 24">
                  <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
                </svg>
                <p className="a12345678901b45">No resource usage records found.</p>
              </div>
            )
          )}
        </div>

      </main>
      <footer className="f7890123456">
  <p className="c8901234567">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
</footer>
    </div>
  );

};

export default ViewResourceUsage;
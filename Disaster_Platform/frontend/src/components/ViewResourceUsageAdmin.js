import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/ViewResourceUsageAdmin.css";
import AdminSidebar from "./AdminSidebar";

const AdminViewResourceUsage = () => {
  const { user } = useUser();
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
  // Base URLs for API endpoints
  const resourceTypesBaseUrl = "http://localhost:5000/api/resourceTypes";
  const sheltersBaseUrl = "http://localhost:5000/api/resourceTypes";

  useEffect(() => {
    // Fetch initial data when component mounts
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Admin gets all shelters, not just ones they own or are assigned to
      const sheltersRes = await axios.get(`${sheltersBaseUrl}/all`);
      setShelters(sheltersRes.data);
      
      // Get resource types list
      const typesRes = await axios.get(`${resourceTypesBaseUrl}/list`);
      setResourceTypes(typesRes.data);
      
      // If there are shelters, select the first one by default
      if (sheltersRes.data && sheltersRes.data.length > 0) {
        setSelectedShelterId(sheltersRes.data[0]._id);
        await fetchUsageRecords(sheltersRes.data[0]._id);
      } else {
        setError("No shelters found in the system.");
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
      // Use createdAt field to match your schema
      const date = new Date(record.createdAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      
      // Create a copy of the record with possibly filtered resources
      const recordCopy = {...record};
      
      // Filter resources if a resource type filter is active
      if (filters.resourceType) {
        recordCopy.resources = record.resources.filter(
          resource => resource.resourceType?._id === filters.resourceType
        );
        
        // Skip this record if it has no matching resources after filtering
        if (recordCopy.resources.length === 0) return;
      }
      
      grouped[date].push(recordCopy);
    });
    return grouped;
  };

  const groupedUsage = groupUsageByDate();
  
  // Find the currently selected shelter object
  const selectedShelter = shelters.find(shelter => shelter._id === selectedShelterId);

  if (loading && shelters.length === 0) return <div className="a143b256317462">Loading...</div>;
  if (error && shelters.length === 0) return <div className="a143b256317463">{error}</div>;
  if (shelters.length === 0) return <p className="a143b256317463">No shelters found in the system.</p>;

  return (
    <div className="a143b256317452">
      <AdminSidebar />
      <main className="a143b256317453">
        <div className="a143b256317454">
          <h2 className="a143b256317455">Admin Resource Usage Dashboard</h2>
          
          <div className="a143b256317501">
            <label htmlFor="shelter-select">Select Shelter:</label>
            <select 
              id="shelter-select" 
              value={selectedShelterId} 
              onChange={handleShelterChange}
              className="a143b256317502"
            >
              <option value="">-- Select a Shelter --</option>
              {shelters.map(shelter => (
                <option key={shelter._id} value={shelter._id}>
                  {shelter.location}
                </option>
              ))}
            </select>
          </div>
          
          {selectedShelter && (
            <div className="a143b256317503">
              <h3 className="a143b256317504">Shelter: {selectedShelter.location}</h3>
              <div className="a143b256317505">
                <div className="a143b256317506">
                  <strong>Capacity:</strong> {selectedShelter.inmates}/{selectedShelter.totalCapacity}
                </div>
                <div className="a143b256317506">
                  <strong>Contact:</strong> {selectedShelter.contactDetails}
                </div>
                {selectedShelter.owner && (
                  <div className="a143b256317506">
                    <strong>Owner:</strong> {selectedShelter.owner.name || selectedShelter.owner}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="a143b256317456">
            <h4 className="a143b256317507">Filter Records</h4>
            <div className="a143b256317457">
              <div className="a143b256317508">
                <div className="a143b256317458">
                  <label>Start Date:</label>
                  <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                </div>
                
                <div className="a143b256317458">
                  <label>End Date:</label>
                  <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                </div>
                
                <div className="a143b256317458">
                  <label>Resource Type:</label>
                  <select name="resourceType" value={filters.resourceType} onChange={handleFilterChange}>
                    <option value="">All Resources</option>
                    {resourceTypes.map(type => (
                      <option key={type._id} value={type._id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="a143b256317459">
                  <button onClick={applyFilters} className="a143b256317460">Apply Filters</button>
                  <button onClick={resetFilters} className="a143b256317461">Reset</button>
                </div>
              </div>
            </div>
          </div>

          {loading && <div className="a143b256317462">Loading records...</div>}
          
          {!loading && Object.keys(groupedUsage).length > 0 ? (
            <div className="a143b256317509">
              {Object.entries(groupedUsage).map(([date, records]) => (
                <div key={date} className="a143b256317510">
                  <div className="a143b256317511">
                    <h4>Date: {date}</h4>
                  </div>
                  
                  {records.map((record) => (
                    <div key={record._id} className="a143b256317512">
                      <div className="a143b256317513">
                        <h5>Recorded: {formatDate(record.createdAt)}</h5>
                        <span className="a143b256317514">By: {record.volunteer?.name || "Unknown"}</span>
                      </div>
                      
                      <div className="a143b256317515">
                        <table className="a143b256317516">
                          <thead>
                            <tr>
                              <th>Resource</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record.resources.map((resource, index) => (
                              <tr key={index}>
                                <td>{resource.resourceType?.name || "Unknown"}</td>
                                <td>{resource.quantity}</td>
                                <td>{resource.unit}</td>
                                <td>{resource.description || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* {record.notes && <div className="a143b256317517"><strong>Notes:</strong> {record.notes}</div>} */}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="a143b256317518">No resource usage records found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminViewResourceUsage;
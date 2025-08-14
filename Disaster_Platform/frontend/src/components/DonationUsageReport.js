import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/DonationUsageReport.css";

const DonationUsageReport = () => {
  const { user } = useUser();
  const [donations, setDonations] = useState({ total: 0, allocated: 0, remaining: 0 });
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    resourceType: ""
  });
  const [resourceTypes, setResourceTypes] = useState([]);
  const baseUrl = "http://localhost:5000/api";

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const summaryRes = await axios.get(`${baseUrl}/donations/summary`);
      setDonations(summaryRes.data);
      
      const allocationsRes = await axios.get(`${baseUrl}/donations/allocations`);
      setAllocations(allocationsRes.data);
      
      const typesRes = await axios.get(`${baseUrl}/resourceTypes/list`);
      setResourceTypes(typesRes.data);
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.resourceType) params.append("resourceType", filters.resourceType);
      
      const allocationsRes = await axios.get(`${baseUrl}/donations/allocations?${params}`);
      setAllocations(allocationsRes.data);
      
      if (filters.resourceType) {
        let total = 0;
        let allocated = 0;
        
        allocationsRes.data.forEach(allocation => {
          const filteredItems = allocation.allocations.filter(item => 
            item.resourceType && item.resourceType._id === filters.resourceType
          );
          
          const itemsTotal = filteredItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
          allocated += itemsTotal;
          total += itemsTotal;
        });
        
        setDonations({
          total: total,
          allocated: allocated,
          remaining: total - allocated
        });
      } else {
        let total = 0;
        let allocated = 0;
        
        allocationsRes.data.forEach(allocation => {
          allocated += allocation.totalCost;
          total += allocation.totalCost;
        });
        
        setDonations({
          total: total,
          allocated: allocated,
          remaining: total - allocated
        });
      }
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to filter records.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({ startDate: "", endDate: "", resourceType: "" });
    fetchInitialData();
  };

  const groupAllocationsByDate = () => {
    const grouped = {};
    allocations.forEach(allocation => {
      const date = new Date(allocation.createdAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      
      if (filters.resourceType) {
        const filteredAllocation = {
          ...allocation,
          allocations: allocation.allocations.filter(item => 
            item.resourceType && item.resourceType._id === filters.resourceType
          )
        };
        
        if (filteredAllocation.allocations.length > 0) {
          grouped[date].push(filteredAllocation);
        }
      } else {
        grouped[date].push(allocation);
      }
    });
    return grouped;
  };

  const groupedAllocations = groupAllocationsByDate();

  if (loading && allocations.length === 0) return <div className="a1234567b89012-loading">Loading...</div>;
  if (error && allocations.length === 0) return <div className="a1234567b89012-error">{error}</div>;

  return (
    <div className="a1234567b89012">
      <AdminSidebar />
      <main className="b2234567b89012">
        <div className="c3234567b89012">
          <h2 className="d4234567b89012">Donation Usage Report</h2>
          
          <div className="e5234567b89012">
            <h3 className="f6234567b89012">Donation Summary</h3>
            <div className="g7234567b89012">
              <div className="h8234567b89012">
                <div className="i9234567b89012">Total Donations</div>
                <div className="j0234567b89012">{formatCurrency(donations.total)}</div>
              </div>
              <div className="k1234567b89012">
                <div className="l2234567b89012">Allocated</div>
                <div className="m3234567b89012">{formatCurrency(donations.allocated)}</div>
              </div>
              <div className="n4234567b89012">
                <div className="o5234567b89012">Available Balance</div>
                <div className="p6234567b89012">{formatCurrency(donations.remaining)}</div>
              </div>
            </div>
          </div>

          <div className="q7234567b89012">
            <h4 className="r8234567b89012">Filter Records</h4>
            <div className="s9234567b89012">
              <div className="t0234567b89012">
                <label className="u1234567b89012">Start Date:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={filters.startDate} 
                  onChange={handleFilterChange}
                  className="v2234567b89012"
                />
              </div>
              
              <div className="w3234567b89012">
                <label className="x4234567b89012">End Date:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={filters.endDate} 
                  onChange={handleFilterChange}
                  className="y5234567b89012"
                />
              </div>
              
              <div className="z6234567b89012">
                <label className="a7234567b89012">Resource Type:</label>
                <select 
                  name="resourceType" 
                  value={filters.resourceType} 
                  onChange={handleFilterChange}
                  className="b8234567b89012"
                >
                  <option value="">All Resources</option>
                  {resourceTypes.map(type => (
                    <option key={type._id} value={type._id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="c9234567b89012">
                <button 
                  onClick={applyFilters} 
                  className="d0234567b89012"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={resetFilters} 
                  className="e1234567b89012"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {loading && <div className="f2234567b89012">Loading records...</div>}
          
          {!loading && Object.keys(groupedAllocations).length > 0 ? (
            <div className="g3234567b89012">
              {Object.entries(groupedAllocations).map(([date, dateAllocations]) => (
                <div key={date} className="h4234567b89012">
                  <div className="i5234567b89012">
                    <h4 className="j6234567b89012">Date: {date}</h4>
                  </div>
                  
                  {dateAllocations.map((allocation) => (
                    <div key={allocation.id} className="k7234567b89012">
                      <div className="l8234567b89012">
                        <h5 className="m9234567b89012">Allocated: {formatDate(allocation.createdAt)}</h5>
                        <span className="n0234567b89012">By: {allocation.admin?.name || "System"}</span>
                        <span className="o1234567b89012">Total: {formatCurrency(allocation.totalCost)}</span>
                      </div>
                      
                      <table className="p2234567b89012">
                        <thead>
                          <tr>
                            <th>Resource</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Cost (per unit)</th>
                            <th>Total Cost</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allocation.allocations.map((resource, index) => (
                            <tr key={index}>
                              <td>{resource.resourceType?.name || "Unknown Resource"}</td>
                              <td>{resource.quantity}</td>
                              <td>{resource.unit}</td>
                              <td>{formatCurrency(resource.cost)}</td>
                              <td>{formatCurrency(resource.quantity * resource.cost)}</td>
                              <td>{resource.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="q3234567b89012">No donation allocation records found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonationUsageReport;
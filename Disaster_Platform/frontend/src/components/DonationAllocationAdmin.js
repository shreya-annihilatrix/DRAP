import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/DonationAllocationAdmin.css";

const DonationAllocation = () => {
  const { user } = useUser();
  const [donations, setDonations] = useState({ total: 0, allocated: 0, remaining: 0 });
  const [resourceTypes, setResourceTypes] = useState([]);
  const [allocations, setAllocations] = useState([
    { resourceType: "", quantity: "", unit: "", cost: "", description: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [allocationHistory, setAllocationHistory] = useState([]);

  const availableUnits = [
    "kg", "g", "liters", "ml", "pieces", "boxes", "packs", "bottles", 
    "cartons", "cans", "pairs", "rolls", "sets", "units"
  ];

  useEffect(() => {
    if (user?.role === "admin") {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [donationsRes, typesRes, historyRes] = await Promise.all([
        axios.get("http://localhost:5000/api/donations/summary"),
        axios.get("http://localhost:5000/api/resourceTypes/list"),
        axios.get("http://localhost:5000/api/donations/allocations")
      ]);
      
      setDonations(donationsRes.data);
      setResourceTypes(typesRes.data);
      setAllocationHistory(historyRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocationChange = (index, field, value) => {
    const updatedAllocations = [...allocations];
    updatedAllocations[index][field] = value;
    
    if (field === "quantity" || field === "cost") {
      const quantity = parseFloat(field === "quantity" ? value : updatedAllocations[index].quantity) || 0;
      const cost = parseFloat(field === "cost" ? value : updatedAllocations[index].cost) || 0;
      updatedAllocations[index].totalCost = (quantity * cost).toFixed(2);
    }
    
    setAllocations(updatedAllocations);
  };

  const addAllocationField = () => {
    setAllocations([...allocations, { resourceType: "", quantity: "", unit: "", cost: "", description: "" }]);
  };

  const removeAllocationField = (index) => {
    if (allocations.length > 1) {
      setAllocations(allocations.filter((_, i) => i !== index));
    }
  };

  const calculateTotalAllocationCost = () => {
    return allocations.reduce((total, item) => {
      return total + (parseFloat(item.quantity || 0) * parseFloat(item.cost || 0));
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (allocations.some(a => !a.resourceType || !a.quantity || !a.unit || !a.cost)) {
      setError("Please complete all required fields for each allocation.");
      return;
    }
    
    const totalCost = calculateTotalAllocationCost();
    
    if (totalCost > donations.remaining) {
      setError(`Insufficient funds. Total cost (${formatCurrency(totalCost)}) exceeds available balance (${formatCurrency(donations.remaining)}).`);
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await axios.post("http://localhost:5000/api/donations/allocate", {
        allocations: allocations,
        totalCost: totalCost
      });
      alert("Funds Allocated Successfully");
      setSuccess("Funds allocated successfully!");
      setAllocations([{ resourceType: "", quantity: "", unit: "", cost: "", description: "" }]);
      fetchInitialData();
    } catch (err) {
      console.error("Error allocating donations:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to allocate funds. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="a123456b789012">
        <AdminSidebar />
        <main className="b223456b789012">
          <div className="c323456b789012">
            <h2>Donation Allocation</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="a123456b789012">
      <AdminSidebar />
      <main className="b223456b789012">
        <div className="c323456b789012">
          <h1 className="d423456b789012">Donation Allocation Dashboard</h1>
          
          {error && <div className="e523456b789012">{error}</div>}
          {success && <div className="f623456b789012">{success}</div>}
          
          <div className="g723456b789012">
            <h2 className="h823456b789012">Donation Summary</h2>
            <div className="i923456b789012">
              <div className="j023456b789012">
                <div className="k123456b789012">Total Donations</div>
                <div className="l223456b789012">{formatCurrency(donations.total)}</div>
              </div>
              <div className="m323456b789012">
                <div className="n423456b789012">Allocated</div>
                <div className="o523456b789012">{formatCurrency(donations.allocated)}</div>
              </div>
              <div className="p623456b789012">
                <div className="q723456b789012">Available Balance</div>
                <div className="r823456b789012">{formatCurrency(donations.remaining)}</div>
              </div>
            </div>
          </div>
          
          <div className="s923456b789012">
            <h2 className="t023456b789012">Allocate Funds</h2>
            <form onSubmit={handleSubmit} className="u123456b789012">
              <div className="v223456b789012">
                <h3 className="w323456b789012">Resource Allocations</h3>
                {allocations.map((allocation, index) => (
                  <div key={index} className="x423456b789012">
                    <div className="y523456b789012">
                      <div className="z623456b789012">
                        <label className="a723456b789012">Resource:</label>
                        <select 
                          className="b823456b789012"
                          value={allocation.resourceType} 
                          onChange={(e) => handleAllocationChange(index, "resourceType", e.target.value)}
                          required
                        >
                          <option value="">Select Resource</option>
                          {resourceTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="c923456b789012">
                        <label className="d023456b789012">Quantity:</label>
                        <input 
                          type="number" 
                          className="e123456b789012"
                          value={allocation.quantity} 
                          onChange={(e) => handleAllocationChange(index, "quantity", e.target.value)}
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="f223456b789012">
                        <label className="g323456b789012">Unit:</label>
                        <select 
                          className="h423456b789012"
                          value={allocation.unit} 
                          onChange={(e) => handleAllocationChange(index, "unit", e.target.value)}
                          required
                        >
                          <option value="">Select Unit</option>
                          {availableUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="i523456b789012">
                        <label className="j623456b789012">Cost (₹):</label>
                        <input 
                          type="number" 
                          className="k723456b789012"
                          value={allocation.cost} 
                          onChange={(e) => handleAllocationChange(index, "cost", e.target.value)}
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="l823456b789012">
                      <div className="m923456b789012">
                        <label className="n023456b789012">Description (optional):</label>
                        <textarea 
                          className="o123456b789012"
                          value={allocation.description} 
                          onChange={(e) => handleAllocationChange(index, "description", e.target.value)}
                          placeholder="Additional details"
                        />
                      </div>
                      
                      <div className="p223456b789012">
                        <label className="q323456b789012">Cost: </label>
                        {formatCurrency(parseFloat(allocation.quantity || 0) * parseFloat(allocation.cost || 0))}
                      </div>
                      
                      {allocations.length > 1 && (
                        <button 
                          type="button" 
                          className="r423456b789012" 
                          onClick={() => removeAllocationField(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button type="button" className="s523456b789012" onClick={addAllocationField}>
                  + Add Resource
                </button>
                
                <div className="t623456b789012">
                  <h4 className="u723456b789012">Summary</h4>
                  <p className="v823456b789012">Total Cost: {formatCurrency(calculateTotalAllocationCost())}</p>
                  <p className="w923456b789012">Remaining After Allocation: {formatCurrency(donations.remaining - calculateTotalAllocationCost())}</p>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="x023456b789012" 
                disabled={loading || calculateTotalAllocationCost() <= 0 || calculateTotalAllocationCost() > donations.remaining}
              >
                {loading ? "Processing..." : "Allocate Funds"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationAllocation;
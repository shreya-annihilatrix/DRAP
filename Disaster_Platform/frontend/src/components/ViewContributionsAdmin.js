import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AdminSidebar from "./AdminSidebar";
import "../styles/ViewContributionsAdmin.css";

const AdminContributions = () => {
  const { user } = useUser();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filters, setFilters] = useState({
    shelter: "",
    status: "",
    date: ""
  });
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAllContributions();
      fetchShelters();
    } else {
      setLoading(false);
      setError("You don't have permission to view this page.");
    }
  }, [user]);

  const fetchShelters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resourceTypes/shelters");
      setShelters(response.data);
    } catch (err) {
      console.error("Error fetching shelters:", err);
    }
  };

  const fetchAllContributions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/resourceTypes/contributions");
      
      const sortedContributions = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setContributions(sortedContributions);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching contributions:", err);
      setError("Failed to load contributions. Please try again.");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      shelter: "",
      status: "",
      date: ""
    });
  };

  const verifyContribution = async (contributionId) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/resourceTypes/approve-contribution/${contributionId}`
      );
      
      setContributions(prevContributions => 
        prevContributions.map(contribution => 
          contribution._id === contributionId 
            ? { ...contribution, status: 1 } 
            : contribution
        )
      );
      
      setSuccessMessage("Contribution verified successfully!");
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      setLoading(false);
    } catch (err) {
      console.error("Error verifying contribution:", err);
      setError("Failed to verify contribution. Please try again.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return <span className="a12345678b9012-status-pending">Pending</span>;
      case 1:
        return <span className="a12345678b9012-status-verified">Verified</span>;
      default:
        return <span className="a12345678b9012-status-unknown">Unknown</span>;
    }
  };

  const filteredContributions = contributions.filter(contribution => {
    const matchesShelter = filters.shelter ? contribution.shelter._id === filters.shelter : true;
    const matchesStatus = filters.status !== "" ? contribution.status === parseInt(filters.status) : true;
    
    let matchesDate = true;
    if (filters.date) {
      const filterDate = new Date(filters.date).setHours(0, 0, 0, 0);
      const contributionDate = new Date(contribution.createdAt).setHours(0, 0, 0, 0);
      matchesDate = filterDate === contributionDate;
    }
    
    return matchesShelter && matchesStatus && matchesDate;
  });

  return (
    <div className="a12345678b9012">
      <AdminSidebar />
      <main className="b22345678b9012">
        <div className="c32345678b9012">
          <h2 className="d42345678b9012">All Contributions</h2>
          {error && <p className="e52345678b9012">{error}</p>}
          {successMessage && <p className="f62345678b9012">{successMessage}</p>}

          {!loading && user && user.role === "admin" && (
            <div className="g72345678b9012">
              <h3 className="h82345678b9012">Filter Contributions</h3>
              <div className="i92345678b9012">
                <div className="j02345678b9012">
                  <label htmlFor="shelter" className="k12345678b9012">Shelter:</label>
                  <select 
                    id="shelter" 
                    name="shelter" 
                    value={filters.shelter} 
                    onChange={handleFilterChange}
                    className="l22345678b9012"
                  >
                    <option value="">All Shelters</option>
                    {shelters.map(shelter => (
                      <option key={shelter._id} value={shelter._id}>
                        {shelter.location}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="m32345678b9012">
                  <label htmlFor="status" className="n42345678b9012">Status:</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange}
                    className="o52345678b9012"
                  >
                    <option value="">All Statuses</option>
                    <option value="0">Pending</option>
                    <option value="1">Verified</option>
                  </select>
                </div>
                
                <div className="p62345678b9012">
                  <label htmlFor="date" className="q72345678b9012">Date:</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={filters.date} 
                    onChange={handleFilterChange}
                    className="r82345678b9012"
                  />
                </div>
                
                <button className="s92345678b9012" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="t02345678b9012">Loading...</div>
          ) : user && user.role === "admin" ? (
            <>
              <div className="u12345678b9012">
                <div className="v22345678b9012">
                  <h4 className="w32345678b9012">Total Contributions</h4>
                  <p className="x42345678b9012">{contributions.length}</p>
                </div>
                <div className="y52345678b9012">
                  <h4 className="z62345678b9012">Pending</h4>
                  <p className="a72345678b9012">{contributions.filter(c => c.status === 0).length}</p>
                </div>
                <div className="b82345678b9012">
                  <h4 className="c92345678b9012">Verified</h4>
                  <p className="d02345678b9012">{contributions.filter(c => c.status === 1).length}</p>
                </div>
              </div>

              {filteredContributions.length > 0 ? (
                <div className="e12345678b9012">
                  {filteredContributions.map((contribution) => (
                    <div key={contribution._id} className="f22345678b9012">
                      <div className="g32345678b9012">
                        <h3 className="h42345678b9012">Contribution from {contribution.contributorName}</h3>
                        <div className="i52345678b9012">
                          <span className="j62345678b9012">
                            Date: {formatDate(contribution.createdAt)}
                          </span>
                          <span className="k72345678b9012">
                            Status: {getStatusLabel(contribution.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="l82345678b9012">
                        <p className="m92345678b9012"><strong>Shelter:</strong> {contribution.shelter.location}</p>
                      </div>
                      
                      <div className="n02345678b9012">
                        <table className="o12345678b9012">
                          <thead>
                            <tr>
                              <th>Resource</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contribution.resources.map((resource, index) => (
                              <tr key={index}>
                                <td>{resource.resourceType.name}</td>
                                <td>{resource.quantity}</td>
                                <td>{resource.unit}</td>
                                <td>{resource.description || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="p22345678b9012">
                        <p className="q32345678b9012"><strong>Contributor:</strong> {contribution.contributorName}</p>
                        <p className="r42345678b9012"><strong>Contact:</strong> {contribution.contributorContact}</p>
                        {contribution.contributorId && (
                          <p className="s52345678b9012"><strong>Contributor ID:</strong> {contribution.contributorId}</p>
                        )}
                      </div>
                      
                      {contribution.status === 0 && (
                        <div className="t62345678b9012">
                          <button
                            onClick={() => verifyContribution(contribution._id)}
                            className="u72345678b9012"
                          >
                            Verify Contribution
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="v82345678b9012">
                  <p className="w92345678b9012">No contributions match your filter criteria.</p>
                </div>
              )}
            </>
          ) : (
            <div className="x02345678b9012">
              <p className="y12345678b9012">You don't have permission to view this page. Please log in as an administrator.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminContributions;
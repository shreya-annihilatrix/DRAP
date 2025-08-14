import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import NavBar from "../components/Navbar";
import "../styles/VerifyContributionVolunteer.css";

const VerifyContributions = () => {
  const { user } = useUser();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shelter, setShelter] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeButton, setActiveButton] = useState(5); // Assuming verify contributions is button 5

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      fetchAssignedShelter(userId);
    } else {
      setLoading(false);
      setError("Please log in to verify contributions.");
    }
  }, [user]);

  const fetchAssignedShelter = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/resourceTypes/shelter-assigned/${userId}`
      );
      setShelter(response.data);
      
      // After getting the shelter, fetch its contributions
      if (response.data && response.data._id) {
        fetchShelterContributions(response.data._id);
      }
    } catch (err) {
      console.error("Error fetching assigned shelter:", err);
      setError("You don't have any assigned shelters to verify contributions for.");
      setLoading(false);
    }
  };

  const fetchShelterContributions = async (shelterId) => {
    try {
      // Create a dedicated endpoint for fetching shelter-specific contributions
      const response = await axios.get(
        `http://localhost:5000/api/resourceTypes/shelter-contributions/${shelterId}`
      );
      
      setContributions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching shelter contributions:", err);
      setError("Failed to load contributions. Please try again.");
      setLoading(false);
    }
  };

  const verifyContribution = async (contributionId) => {
    try {
      setLoading(true); // Show loading while verification is in progress
      await axios.put(
        `http://localhost:5000/api/resourceTypes/approve-contribution/${contributionId}`
      );
      
      // Show success message
      setSuccessMessage("Contribution verified successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      // Refresh the contributions list directly
      if (shelter && shelter._id) {
        fetchShelterContributions(shelter._id);
      }
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
        return <span className="a123456789012b33">Pending</span>;
      case 1:
        return <span className="a123456789012b34">Verified</span>;
      default:
        return <span className="a123456789012b35">Unknown</span>;
    }
  };

  return (
    <div className="a123456789012b00">
      <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
      
      <main className="a123456789012b01">
        <div className="a123456789012b02">
          <h2 className="a123456789012b03">Verify Contributions</h2>
          
          {error && <p className="a123456789012b04">{error}</p>}
          {successMessage && <p className="a123456789012b05">{successMessage}</p>}

          {loading ? (
            <div className="a123456789012b06">
              <div className="a123456789012b07"></div>
              <p>Loading...</p>
            </div>
          ) : shelter ? (
            <>
              <div className="a123456789012b08">
                <h3 className="a123456789012b09">Assigned Shelter: {shelter.location}</h3>
                <div className="a123456789012b10">
                  <div className="a123456789012b11">
                    <span className="a123456789012b12">Capacity:</span>
                    <span className="a123456789012b13">{shelter.inmates || 0}/{shelter.totalCapacity || 0}</span>
                  </div>
                  <div className="a123456789012b11">
                    <span className="a123456789012b12">Contact:</span>
                    <span className="a123456789012b13">{shelter.contactDetails || "Not Available"}</span>
                  </div>
                </div>
              </div>

              {contributions.length > 0 ? (
                <div className="a123456789012b14">
                  {contributions.map((contribution) => (
                    <div key={contribution._id} className="a123456789012b15">
                      <div className="a123456789012b16">
                        <h3 className="a123456789012b17">Contribution from {contribution.contributorName}</h3>
                        <div className="a123456789012b18">
                          <span className="a123456789012b19">
                            Date: {formatDate(contribution.createdAt)}
                          </span>
                          <span className="a123456789012b20">
                            Status: {getStatusLabel(contribution.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="a123456789012b21">
                        <table className="a123456789012b22">
                          <thead className="a123456789012b23">
                            <tr>
                              <th className="a123456789012b24">Resource</th>
                              <th className="a123456789012b24">Quantity</th>
                              <th className="a123456789012b24">Unit</th>
                              <th className="a123456789012b24">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contribution.resources.map((resource, index) => (
                              <tr key={index} className={index % 2 === 0 ? "a123456789012b25" : "a123456789012b26"}>
                                <td className="a123456789012b27">{resource.resourceType.name}</td>
                                <td className="a123456789012b27">{resource.quantity}</td>
                                <td className="a123456789012b27">{resource.unit}</td>
                                <td className="a123456789012b27">{resource.description || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="a123456789012b28">
                        <p><strong>Contributor:</strong> {contribution.contributorName}</p>
                        <p><strong>Contact:</strong> {contribution.contributorContact}</p>
                      </div>
                      
                      {contribution.status === 0 && (
                        <div className="a123456789012b29">
                          <button
                            onClick={() => verifyContribution(contribution._id)}
                            className="a123456789012b30"
                          >
                            Verify Contribution
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="a123456789012b31">
                  <svg className="a123456789012b32" viewBox="0 0 24 24">
                    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
                  </svg>
                  <p>There are no contributions for this shelter yet.</p>
                </div>
              )}
            </>
          ) : (
            <div className="a123456789012b31">
              <svg className="a123456789012b32" viewBox="0 0 24 24">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
              </svg>
              <p>You don't have any assigned shelters. Please contact an administrator.</p>
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

export default VerifyContributions;
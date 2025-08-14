import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/PublicResourceContributions.css";

const ViewUserContributions = () => {
  const { user } = useUser();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      fetchContributions(userId);
    } else {
      setLoading(false);
      setError("Please log in to view your contributions.");
    }
  }, [user]);

  const fetchContributions = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/resourceTypes/user-contributions/${userId}`
      );
      setContributions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching contributions:", err);
      setError("Failed to load contributions. Please try again.");
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
        return <span className="a00000010000001">Pending</span>;
      case 1:
        return <span className="a00000010000002">Verified</span>;
      default:
        return <span className="a00000010000003">Unknown</span>;
    }
  };

  return (
    <div className="a00000010000004">
      <PublicNavbar />
      
      <main className="a00000010000005">
        <div className="a00000010000006">
          <h2 className="a00000010000007">My Contributions</h2>
          
          {error && <div className="a00000010000008">{error}</div>}

          {loading ? (
            <div className="a00000010000009">
              <div className="a00000010000010"></div>
              <p>Loading your contributions...</p>
            </div>
          ) : contributions.length > 0 ? (
            <div className="a00000010000011">
              {contributions.map((contribution) => (
                <div key={contribution._id} className="a00000010000012">
                  <div className="a00000010000013">
                    <h3 className="a00000010000014">
                      Contribution to {contribution.shelter?.location || "Unknown Shelter"}
                    </h3>
                    <div className="a00000010000015">
                      <span className="a00000010000016">
                        Date: {formatDate(contribution.createdAt)}
                      </span>
                      <span className="a00000010000017">
                        Status: {getStatusLabel(contribution.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="a00000010000018">
                    <table className="a00000010000019">
                      <thead className="a00000010000020">
                        <tr className="a00000010000021">
                          <th className="a00000010000022">Resource</th>
                          <th className="a00000010000023">Quantity</th>
                          <th className="a00000010000024">Unit</th>
                          <th className="a00000010000025">Description</th>
                        </tr>
                      </thead>
                      <tbody className="a00000010000026">
                        {contribution.resources.map((resource, index) => (
                          <tr key={index} className="a00000010000027">
                            <td className="a00000010000028">{resource.resourceType?.name || "Unknown"}</td>
                            <td className="a00000010000029">{resource.quantity}</td>
                            <td className="a00000010000030">{resource.unit}</td>
                            <td className="a00000010000031">{resource.description || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="a00000010000032">
                    <p className="a00000010000033">
                      <span className="a00000010000034">Submitted as:</span> {contribution.contributorName}
                    </p>
                    <p className="a00000010000035">
                      <span className="a00000010000034">Contact:</span> {contribution.contributorContact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="a00000010000036">
              <svg className="a00000010000037" viewBox="0 0 24 24">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
              </svg>
              <p className="a00000010000038">You haven't made any contributions yet.</p>
              <button 
                onClick={() => window.location.href = "/public/contribute-res"} 
                className="a00000010000039"
              >
                Contribute Now
              </button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewUserContributions;
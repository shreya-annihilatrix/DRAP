import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/ViewCampaignPublic.css";

const ViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/donations/campaigns");
      setCampaigns(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  const handleMakeDonation = (campaignId) => {
    navigate(`/public/make-donation/${campaignId}`);
  };

  // Calculate progress percentage
  const calculateProgress = (collected, target) => {
    // Ensure collected and target are treated as numbers
    const collectedNum = Number(collected) || 0;
    const targetNum = Number(target) || 1; // Prevent division by zero
    
    const percentage = (collectedNum / targetNum) * 100;
    return Math.min(percentage, 100).toFixed(1);
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Check if campaign is active (days remaining > 0)
  const isCampaignActive = (endDate) => {
    return calculateDaysRemaining(endDate) > 0;
  };

  return (
    <div className="a00000001000001">
      <PublicNavbar />
      
      <main className="a00000001000002">
        <div className="a00000001000003">
          <h2 className="a00000001000004">Current Donation Campaigns</h2>
          
          {loading ? (
            <div className="a00000001000005">
              <div className="a00000001000006"></div>
              <p>Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="a00000001000007">
              <svg className="a00000001000008" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>No active campaigns available.</p>
            </div>
          ) : (
            <div className="a00000001000009">
              {campaigns.map((campaign) => (
                <div className="a00000001000010" key={campaign._id}>
                  <div className="a00000001000011">
                    <h3 className="a00000001000012">{campaign.title}</h3>
                    <p className="a00000001000013">{campaign.description}</p>
                    
                    <div className="a00000001000014">
                      {/* <div className="a00000001000015">
                        <div 
                          className="a00000001000016" 
                          style={{ width: `${calculateProgress(campaign.collectedAmount || 0, campaign.targetAmount)}%` }}
                        ></div>
                      </div> */}
                      <div className="a00000001000017">
                        <span>₹{campaign.collectedAmount || 0} raised</span>
                        <span>₹{campaign.targetAmount} goal</span>
                      </div>
                    </div>
                    
                    <div className="a00000001000018">
                      {/* <div className="a00000001000019">
                        <span className="a00000001000020">{calculateProgress(campaign.collectedAmount || 0, campaign.targetAmount)}%</span>
                        <span>funded</span>
                      </div> */}
                      <div className="a00000001000019">
                        <span className="a00000001000020">{calculateDaysRemaining(campaign.endDate)}</span>
                        <span>days left</span>
                      </div>
                    </div>
                    
                    <button 
                      className={`a00000001000021 ${!isCampaignActive(campaign.endDate) ? "a00000001000022" : ""}`}
                      onClick={() => isCampaignActive(campaign.endDate) && handleMakeDonation(campaign._id)}
                      disabled={!isCampaignActive(campaign.endDate)}
                    >
                      {isCampaignActive(campaign.endDate) ? "Make Donation" : "Campaign Ended"}
                    </button>
                  </div>
                </div>
              ))}
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

export default ViewCampaigns;
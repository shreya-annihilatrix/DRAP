import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminDonationsView.css";

const AdminCampaignDonationsView = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setCampaignsLoading(true);
            setError("");
            const response = await axios.get("http://localhost:5000/api/donations/campaigns");
            setCampaigns(response.data);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
            setError("Failed to load campaigns. Please try again.");
        } finally {
            setCampaignsLoading(false);
        }
    };

    const fetchCampaignDonations = async (campaignId) => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(`http://localhost:5000/api/donations/h/campaigns/${campaignId}`);

            const donationsWithUserDetails = await Promise.all(
                response.data.map(async (donation) => {
                    try {
                        const userResponse = await axios.get(`http://localhost:5000/api/donations/users/${donation.donorId}`);
                        return { ...donation, user: userResponse.data };
                    } catch (err) {
                        console.error("Error fetching user details:", err);
                        return { ...donation, user: { name: "Unknown User", email: "unknown@example.com" } };
                    }
                })
            );

            const aggregatedDonations = donationsWithUserDetails.reduce((acc, donation) => {
                const existingEntry = acc.find((d) => d.user.email === donation.user.email);
                if (existingEntry) {
                    existingEntry.amount += donation.amount;
                } else {
                    acc.push({ ...donation });
                }
                return acc;
            }, []);

            setDonations(aggregatedDonations);
        } catch (err) {
            console.error("Error fetching campaign donations:", err);
            setError("Failed to load donations for this campaign");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        fetchCampaignDonations(campaign._id);
    };

    const handleChangeCampaign = (e) => {
        const campaignId = e.target.value;
        if (!campaignId) {
            setSelectedCampaign(null);
            setDonations([]);
            return;
        }
        const campaign = campaigns.find(c => c._id === campaignId);
        handleSelectCampaign(campaign);
    };

    const handleViewDetails = (donation) => {
        setSelectedDonation(donation);
        setShowDetails(true);
    };

    const handleVerifyPayment = async (donationId) => {
        try {
            await axios.put(`http://localhost:5000/api/donations/verify/${donationId}`);
            setDonations((prevDonations) =>
                prevDonations.map((donation) =>
                    donation._id === donationId ? { ...donation, status: "Paid" } : donation
                )
            );
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Failed to verify payment.");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    const formatCurrency = (amount) => `₹${parseFloat(amount).toFixed(2)}`;

    return (
        <div className="a12345b6789012">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="b22345b6789012">
                <div className="c32345b6789012">
                    <h2 className="d42345b6789012">View Donations</h2>
                    
                    {error && <div className="e52345b6789012">{error}</div>}

                    {!showDetails ? (
                        <div className="f62345b6789012">
                            <div className="g72345b6789012">
                                <label htmlFor="h82345b6789012" className="i92345b6789012">Select Campaign:</label>
                                <select 
                                    id="h82345b6789012" 
                                    className="j02345b6789012" 
                                    onChange={handleChangeCampaign} 
                                    disabled={campaignsLoading} 
                                    value={selectedCampaign ? selectedCampaign._id : ""}
                                >
                                    <option value="">-- Select a Campaign --</option>
                                    {campaigns.map(campaign => (
                                        <option key={campaign._id} value={campaign._id}>{campaign.title}</option>
                                    ))}
                                </select>
                            </div>

                            {campaignsLoading && <div className="k12345b6789012">Loading campaigns...</div>}

                            {selectedCampaign && !loading && donations.length > 0 && (
                                <div className="l22345b6789012">
                                    <table className="m32345b6789012">
                                        <thead className="n42345b6789012">
                                            <tr className="o52345b6789012">
                                                <th className="p62345b6789012">Donor</th>
                                                <th className="q72345b6789012">Email</th>
                                                <th className="r82345b6789012">Amount</th>
                                                <th className="s92345b6789012">Date</th>
                                                <th className="t02345b6789012">Status</th>
                                                <th className="u12345b6789012">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="v22345b6789012">
                                            {donations.map(donation => (
                                                <tr key={donation._id} className="w32345b6789012">
                                                    <td className="x42345b6789012">{donation.user.name}</td>
                                                    <td className="y52345b6789012">{donation.user.email}</td>
                                                    <td className="z62345b6789012">{formatCurrency(donation.amount)}</td>
                                                    <td className="a72345b6789012">
                                                        {new Date(donation.createdAt).toLocaleDateString(undefined, {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                        <br />
                                                        at
                                                        <br />
                                                        {new Date(donation.createdAt).toLocaleTimeString(undefined, {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="b82345b6789012">
                                                        <span className={`c92345b6789012 d02345b6789012-${donation.status.toLowerCase()}`}>
                                                            {donation.status}
                                                        </span>
                                                    </td>
                                                    <td className="e12345b6789012">
                                                        <button 
                                                            className="f22345b6789012" 
                                                            onClick={() => handleViewDetails(donation)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {selectedCampaign && !loading && donations.length === 0 && (
                                <div className="g32345b6789012">
                                    No donations found for this campaign.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h42345b6789012">
                            <h3 className="i52345b6789012">Donation Details</h3>
                            <div className="j62345b6789012">
                                <div className="k72345b6789012">
                                    <h4 className="l82345b6789012">Payment Information</h4>
                                    <div className="m92345b6789012">
                                        <div className="n02345b6789012">Payment ID:</div>
                                        <div className="o12345b6789012">{selectedDonation.razorpay_payment_id || "N/A"}</div>
                                    </div>
                                    <div className="p22345b6789012">
                                        <div className="q32345b6789012">Amount:</div>
                                        <div className="r42345b6789012">{formatCurrency(selectedDonation.amount)}</div>
                                    </div>
                                    <div className="s52345b6789012">
                                        <div className="t62345b6789012">Status:</div>
                                        <div className={`u72345b6789012 d02345b6789012-${selectedDonation.status.toLowerCase()}`}>
                                            {selectedDonation.status}
                                        </div>
                                    </div>
                                    <div className="v82345b6789012">
                                        <div className="w92345b6789012">Date:</div>
                                        <div className="x02345b6789012">{formatDate(selectedDonation.createdAt)}</div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="y12345b6789012" 
                                onClick={() => setShowDetails(false)}
                            >
                                Back to Donations
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminCampaignDonationsView;
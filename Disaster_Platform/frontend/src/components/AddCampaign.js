import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "../styles/campaign.css";

const CampaignPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalAmount, setGoalAmount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch campaigns
    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/donations/campaigns");
            setCampaigns(response.data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    const handleAddCampaign = async (e) => {
        e.preventDefault();
        try {
            const newCampaign = {
                title,
                description,
                targetAmount: Number(goalAmount),
                startDate,
                endDate
            };
            await axios.post("http://localhost:5000/api/donations/campaigns", newCampaign);
            fetchCampaigns();
            setTitle("");
            setDescription("");
            setGoalAmount("");
            setStartDate("");
            setEndDate("");
            alert("Campaign added Successfully");
        } catch (error) {
            console.error("Error adding campaign:", error);
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            try {
                await axios.delete(`http://localhost:5000/api/donations/campaigns/${campaignId}`);
                alert("Campaign deleted successfully");
                fetchCampaigns();
            } catch (error) {
                console.error("Error deleting campaign:", error);
                alert("Failed to delete campaign");
            }
        }
    };

    return (
        <div className="a1432b56317524">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="b2432b56317524">
                <div className="c3432b56317524">
                    <h2 className="d4432b56317524">Donation Campaigns</h2>

                    {/* Add Campaign Form */}
                    <div className="e5432b56317524">
                        <h3 className="f6432b56317524">Add New Campaign</h3>
                        <form onSubmit={handleAddCampaign} className="g7432b56317524">
                            <div className="h8432b56317524">
                                <label className="i9432b56317524">Title</label>
                                <input
                                    type="text"
                                    placeholder="Campaign Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="j0432b56317524"
                                    required
                                />
                            </div>
                            <div className="k1432b56317524">
                                <label className="l2432b56317524">Description</label>
                                <textarea
                                    placeholder="Campaign Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="m3432b56317524"
                                    required
                                />
                            </div>
                            <div className="n4432b56317524">
                                <label className="o5432b56317524">Goal Amount (₹)</label>
                                <input
                                    type="number"
                                    placeholder="Target Amount"
                                    value={goalAmount}
                                    min={1}
                                    onChange={(e) => setGoalAmount(e.target.value)}
                                    className="p6432b56317524"
                                    required
                                />
                            </div>
                            <div className="q7432b56317524">
                                <label className="r8432b56317524">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="s9432b56317524"
                                    required
                                />
                            </div>
                            <div className="t0432b56317524">
                                <label className="u1432b56317524">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="v2432b56317524"
                                    required
                                />
                            </div>
                            <button type="submit" className="w3432b56317524">
                                Add Campaign
                            </button>
                        </form>
                    </div>

                    {/* View Campaigns in Table Format */}
                    <div className="x4432b56317524">
                        <h3 className="y5432b56317524">Existing Campaigns</h3>
                        {campaigns.length === 0 ? (
                            <p className="z6432b56317524">No campaigns available.</p>
                        ) : (
                            <div className="a7432b56317524">
                                <table className="b8432b56317524">
                                    <thead className="c9432b56317524">
                                        <tr className="d0432b56317524">
                                            <th className="e1432b56317524">Title</th>
                                            <th className="f2432b56317524">Description</th>
                                            <th className="g3432b56317524">Goal Amount</th>
                                            <th className="h4432b56317524">Collected Amount</th>
                                            <th className="i5432b56317524">End Date</th>
                                            <th className="j6432b56317524">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="k7432b56317524">
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign._id} className="l8432b56317524">
                                                <td className="m9432b56317524">{campaign.title}</td>
                                                <td className="n0432b56317524">{campaign.description}</td>
                                                <td className="o1432b56317524">₹{campaign.targetAmount}</td>
                                                <td className="p2432b56317524">₹{campaign.collectedAmount || 0}</td>
                                                <td className="q3432b56317524">
                                                    {new Date(campaign.endDate).toISOString().slice(0, 10)}
                                                </td>
                                                <td className="r4432b56317524">
                                                    <button
                                                        className="s5432b56317524"
                                                        onClick={() => handleDeleteCampaign(campaign._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CampaignPage;
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/MyDonationsPublic.css";

const MyDonations = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user || !user.id) {
        setError("Please log in to view your donations");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/donations/user-donations/${user.id}`);
        
        const donationsWithCampaignDetails = await Promise.all(
          response.data.map(async (donation) => {
            try {
              const campaignResponse = await axios.get(
                `http://localhost:5000/api/donations/e/campaigns/${donation.campaignId._id}` 
              );
              return {
                ...donation,
                campaign: {
                    title: donation.campaignId.title,
                    _id: donation.campaignId._id
                }
              };
            } catch (err) {
              console.error("Error fetching campaign details:", err);
              return {
                ...donation,
                campaign: { title: donation.campaignId.title || "Unknown Campaign" }
              };
            }
          })
        );
        
        setDonations(donationsWithCampaignDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load your donations");
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const handleGenerateBill = (donation) => {
    setSelectedDonation(donation);
    setShowBill(true);
  };

  const handlePrint = useCallback(() => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert("Please allow pop-ups to print the receipt");
        return;
      }
      
      const content = printRef.current.innerHTML;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Donation Receipt</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.5;
                padding: 20px;
              }
              .a00000000010023 {
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 30px;
              }
              .a00000000010024 h1 {
                color: #2c3e50;
                margin-bottom: 5px;
              }
              .a00000000010025 h2 {
                color: #3498db;
                margin-bottom: 5px;
              }
              .a00000000010025 p {
                margin: 3px 0;
              }
              .a00000000010026, .a00000000010027, .a00000000010028 {
                margin: 20px 0;
              }
              .a00000000010029 {
                display: flex;
                margin: 8px 0;
              }
              .a00000000010030 {
                font-weight: bold;
                width: 120px;
              }
              h3 {
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
                color: #2c3e50;
              }
              .a00000000010031 {
                margin-top: 40px;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
              .a00000000010032 {
                font-size: 0.8em;
                color: #7f8c8d;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        }, 500);
      }, 300);
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="a00000000010001">
        <PublicNavbar />
        <div className="a00000000010002">
          <div className="a00000000010003"></div>
          <p>Loading your donations...</p>
        </div>
      </div>
    );
  }

  if (error && donations.length === 0) {
    return (
      <div className="a00000000010001">
        <PublicNavbar />
        <div className="a00000000010004">
          <div className="a00000000010005">{error}</div>
          <button 
            className="a00000000010006" 
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (donations.length === 0 && !loading) {
    return (
      <div className="a00000000010001">
        <PublicNavbar />
        <div className="a00000000010007">
          <h2 className="a00000000010008">My Donations</h2>
          <p className="a00000000010009">You haven't made any donations yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="a00000000010001">
      <PublicNavbar />
      
      {showBill ? (
        <div className="a00000000010010">
          <div id="donation-bill" className="a00000000010011" ref={printRef}>
            <div className="a00000000010012">
              <h1 className="a00000000010013">Donation Receipt</h1>
              <div className="a00000000010014">
                <h2 className="a00000000010015">Disaster Relief Fund</h2>
                <p className="a00000000010016">Observatory Hills, Vikas Bhavan P.O, Thiruvananthapuram – 695033</p>
                <p className="a00000000010016">Email: drap7907@gmail.com | Phone: +91 7907067848</p>
              </div>
            </div>
            
            <div className="a00000000010017">
              <div className="a00000000010018">
                <span className="a00000000010019">Receipt No:</span>
                <span className="a00000000010020">{selectedDonation.razorpay_payment_id}</span>
              </div>
              <div className="a00000000010018">
                <span className="a00000000010019">Date:</span>
                <span className="a00000000010020">{formatDate(selectedDonation.createdAt)}</span>
              </div>
            </div>
            
            <div className="a00000000010021">
              <h3 className="a00000000010022">Donor Information</h3>
              <div className="a00000000010018">
                <span className="a00000000010019">Name:</span>
                <span className="a00000000010020">{user.name}</span>
              </div>
              <div className="a00000000010018">
                <span className="a00000000010019">Email:</span>
                <span className="a00000000010020">{user.email}</span>
              </div>
              {user.phone && (
                <div className="a00000000010018">
                  <span className="a00000000010019">Phone:</span>
                  <span className="a00000000010020">{user.phone}</span>
                </div>
              )}
            </div>
            
            <div className="a00000000010023">
              <h3 className="a00000000010022">Donation Details</h3>
              <div className="a00000000010018">
                <span className="a00000000010019">Campaign:</span>
                <span className="a00000000010020">{selectedDonation.campaign.title}</span>
              </div>
              <div className="a00000000010018">
                <span className="a00000000010019">Amount:</span>
                <span className="a00000000010020">₹{selectedDonation.amount.toFixed(2)}</span>
              </div>
              <div className="a00000000010018">
                <span className="a00000000010019">Status:</span>
                <span className="a00000000010020">{selectedDonation.status}</span>
              </div>
            </div>
            
            <div className="a00000000010024">
              <p className="a00000000010025">Thank you for your generous donation!</p>
              <p className="a00000000010025">Your contribution helps us provide essential relief to those affected by disasters.</p>
              <p className="a00000000010026">This is an official receipt for your donation. Please keep it for tax purposes.</p>
            </div>
          </div>
          
          <div className="a00000000010027">
            <button className="a00000000010028" onClick={handlePrint}>
              Print Receipt
            </button>
            <button className="a00000000010029" onClick={() => setShowBill(false)}>
              Back to Donations
            </button>
          </div>
        </div>
      ) : (
        <main className="a00000000010030">
          <div className="a00000000010031">
            <h2 className="a00000000010032">My Donations</h2>
            <div className="a00000000010033">
              {donations.map((donation) => (
                <div key={donation._id} className="a00000000010034">
                  <div className="a00000000010035">
                    <h3 className="a00000000010036">{donation.campaign.title}</h3>
                    <p className="a00000000010037">₹{donation.amount.toFixed(2)}</p>
                    <p className="a00000000010038">Donated on: {formatDate(donation.createdAt)}</p>
                    <p className={`a00000000010039 ${donation.status.toLowerCase()}`}>
                      Status: {donation.status}
                    </p>
                    <p className="a00000000010040">Payment ID: {donation.razorpay_payment_id}</p>
                  </div>
                  <div className="a00000000010041">
                    <button
                      className="a00000000010042"
                      onClick={() => handleGenerateBill(donation)}
                    >
                      Generate Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="a00000000010043"
              onClick={() => navigate(-1)}
            >
              Back to Campaigns
            </button>
          </div>
        </main>
      )}
      
      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyDonations;
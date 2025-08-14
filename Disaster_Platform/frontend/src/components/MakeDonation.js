import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import PublicNavbar from "../components/PublicNavbar";
import "../styles/MakeDonation.css";

const MakeDonation = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/donations/campaigns`);
        const campaignData = response.data.find((c) => c._id === campaignId);

        if (campaignData) {
          setCampaign(campaignData);
        } else {
          setError("Campaign not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        setError("Failed to load campaign details");
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError("Please enter a valid donation amount");
      return;
    }

    if (!user || !user.id) {
      setError("You must be logged in to make a donation");
      return;
    }

    try {
      await loadRazorpayScript();

      const response = await axios.post("http://localhost:5000/api/donations/create-order", {
        amount: parseFloat(donationAmount) * 100,
        currency: "INR",
        campaignId,
        donorId: user.id,
      });

      const { id: order_id, amount, currency } = response.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Disaster Relief Fund",
        description: `Donation to ${campaign?.title}`,
        order_id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post("http://localhost:5000/api/donations/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donorId: user.id,
              campaignId,
              amount: parseFloat(amount),
            });

            if (verificationResponse.data.success) {
              alert("Thank you for your donation!");
              navigate(-2);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout form closed");
          },
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="a00000000100001">
        <PublicNavbar />
        <div className="a00000000100002">
          <div className="a00000000100003"></div>
          <p>Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="a00000000100001">
        <PublicNavbar />
        <div className="a00000000100004">
          <p className="a00000000100005">{error}</p>
          <button onClick={() => navigate(-1)} className="a00000000100006">
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="a00000000100001">
      <PublicNavbar />

      <main className="a00000000100007">
        <div className="a00000000100008">
          <div className="a00000000100009">
            <h2 className="a00000000100010">Make a Donation</h2>
            {campaign && <p className="a00000000100011">Campaign: {campaign.title}</p>}

            {error && <p className="a00000000100005">{error}</p>}

            {!user ? (
              <div className="a00000000100012">
                <p className="a00000000100013">You need to be logged in to make a donation.</p>
                <button
                  type="button"
                  className="a00000000100014"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="a00000000100015">
                  <label htmlFor="amount" className="a00000000100016">Donation Amount (₹)</label>
                  <input
                    type="number"
                    id="amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="a00000000100017"
                    required
                    min="1"
                    step="any"
                    placeholder="Enter donation amount"
                  />
                </div>

                <div className="a00000000100018">
                  <p className="a00000000100019">Quick Select Amounts</p>
                  <div className="a00000000100020">
                    {[100, 500, 1000, 5000, 10000].map((amount) => (
                      <div
                        key={amount}
                        className={`a00000000100021 ${donationAmount === amount.toString() ? 'a00000000100025' : ''}`}
                        onClick={() => setDonationAmount(amount.toString())}
                      >
                        <div className="a00000000100026">₹{amount}</div>
                        {amount >= 1000 && (
                          <div className="a00000000100027">
                            {amount === 1000 ? 'Most Popular' : 'Generous Donation'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="a00000000100022">
                  <button type="button" className="a00000000100023" onClick={handlePayment}>
                    Pay Now
                  </button>
                  <button type="button" className="a00000000100024" onClick={() => navigate(-1)}>
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="k1234567l890">
        <p className="l2345678m901">© 2025 Disaster Relief Assistance Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MakeDonation;
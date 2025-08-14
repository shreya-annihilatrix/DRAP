const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  razorpay_payment_id: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // Linking donorId to users collection
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);

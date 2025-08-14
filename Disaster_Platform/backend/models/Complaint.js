const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // This identifies which user submitted the complaint
    },
    complaintType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reportedId: {
      type: String,
      required: true,
      unique: true,
      default: function() {
        // Generate a unique report ID with format COMP-YYYYMMDD-XXXX
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        return `COMP-${year}${month}${day}-${random}`;
      }
      // This is a human-readable reference number for the complaint
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Resolved", "Dismissed"],
      default: "Pending",
    },
    adminComments: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically update the updatedAt field
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skills: [String],
  idProof: String,
  experienceCertificate: String,
  applicationStatus: { type: Number, default: 0 }, // 0 = Pending, 1 = Accepted, 2 = Rejected
  taskStatus: { type: Number, default: 0 },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);

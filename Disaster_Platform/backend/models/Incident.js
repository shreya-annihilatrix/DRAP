const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  location: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: Number, required: true, min: 1, max: 5 }, // 🔹 Ensuring valid severity range (1-5)
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 🔹 Integer-based status
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Incident", incidentSchema);

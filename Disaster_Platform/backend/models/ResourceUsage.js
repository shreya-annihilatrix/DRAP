const mongoose = require("mongoose");

const ResourceUsageSchema = new mongoose.Schema({
    resources: [
        {
            resourceType: { type: mongoose.Schema.Types.ObjectId, ref: "ResourceType", required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }, // Example: kg, liters, packs
            description: { type: String }
        }
    ],
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ResourceUsage", ResourceUsageSchema);
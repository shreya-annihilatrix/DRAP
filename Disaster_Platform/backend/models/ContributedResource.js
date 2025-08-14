const mongoose = require("mongoose");

const ContributedResourceSchema = new mongoose.Schema({
    resources: [
        {
            resourceType: { type: mongoose.Schema.Types.ObjectId, ref: "ResourceType", required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }, // Example: kg, liters, packs
            description: { type: String }
        }
    ],
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true },
    contributorName: { type: String, required: true },
    contributorContact: { type: String, required: true },
    contributorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Added contributor ID field
    status: { type: Number, default: 0 }, // 0 = Pending, 1 = Verified
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ContributedResource", ContributedResourceSchema);
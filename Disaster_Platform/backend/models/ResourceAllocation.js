const mongoose = require("mongoose");

const ResourceAllocationSchema = new mongoose.Schema({
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true },
  resources: [
    {
      resourceType: { type: mongoose.Schema.Types.ObjectId, ref: "ResourceType", required: true }, // References ResourceType model
      unit: { type: String, required: true }, // Dropdown in frontend
      quantity: { type: Number, required: true }, // Quantity allocated
      totalAmount: { type: Number, required: true }, // Total cost amount for this resource
      description: { type: String } // Optional description field
    }
  ],
  allocatedAt: { type: Date, default: Date.now }
});

  
module.exports = mongoose.model("ResourceAllocation", ResourceAllocationSchema);
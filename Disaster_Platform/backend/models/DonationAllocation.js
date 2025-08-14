const mongoose = require("mongoose");
const DonationAllocationSchema = new mongoose.Schema({
  allocations: [
    {
      resourceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResourceType",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true
      },
      cost: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        default: ""
      }
    }
  ],
  totalCost: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DonationAllocation", DonationAllocationSchema);
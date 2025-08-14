const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const User = require("../models/user"); // Import User model
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const DonationAllocation = require("../models/DonationAllocation");
const ResourceType = require('../models/ResourceType');

// let razorpay;

if (process.env.NODE_ENV === "development") {
  // Mock Razorpay object for testing
  razorpay = {
    orders: {
      create: async (options) => {
        return {
          id: "order_test_123",
          amount: options.amount,
          currency: options.currency,
          status: "created",
          receipt: options.receipt
        };
      }
    }
  };
  console.log("🚀 Razorpay bypassed in development mode");
} else {
  const Razorpay = require("razorpay");
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Add this to your donation routes file
const crypto = require('crypto');

router.post("/verify-payment", async (req, res) => {
  try {
    // Extract payment information from request body
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      donorId, 
      campaignId, 
      amount 
    } = req.body;

   
    console.log(req.body);  
      // Save the donation to database
      const donation = new Donation({
        razorpay_payment_id,
        campaignId,
        donorId,
        amount: amount / 100, // Convert back from paise to rupees
        status: "Paid"
      });

      await donation.save();

      // Update campaign collected amount
      await mongoose.model('Campaign').findByIdAndUpdate(
        campaignId,
        { $inc: { collectedAmount: amount / 100 } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      });
    
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency, campaignId, donorId } = req.body;

    const order = await razorpay.orders.create({
      amount,
      currency,
      payment_capture: 1,
      notes: {
        campaignId,
        donorId
      }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});


// Create a new donation campaign
router.post("/campaigns", async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all donation campaigns
router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a donation for a campaign
router.post("/donate", async (req, res) => {
  try {
    const { campaignId, donorId, amount } = req.body;

    // Ensure donor exists
    const donor = await User.findById(donorId);
    if (!donor) return res.status(404).json({ error: "User not found" });

    // Save donation
    const donation = new Donation({ campaignId, donorId, amount });
    await donation.save();

    // Update collected amount in campaign
    await Campaign.findByIdAndUpdate(campaignId, { 
      $inc: { collectedAmount: amount } 
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all donations for a campaign with donor details
router.get("/e/campaigns/:campaignId", async (req, res) => {
  try {
    console.log(req.params.campaignId);
    const donations = await Donation.findById({ campaignId: req.params.campaignId });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Get all donations for a campaign with donor details
// router.get("/:campaignId", async (req, res) => {
//   try {
//     console.log(req.params.campaignId);
//     const donations = await Donation.find({ campaignId: req.params.campaignId }).populate("donorId", "name email");
//     res.status(200).json(donations);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Get all donations made by a specific user
router.get("/user-donations/:userId", async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.params.userId }).populate("campaignId", "title");
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a campaign
router.delete("/campaigns/:id", async (req, res) => {
    try {
      const campaign = await Campaign.findByIdAndDelete(req.params.id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      
      // Optionally, also delete all donations related to this campaign
      await Donation.deleteMany({ campaignId: req.params.id });
      
      res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// Fetch user details
router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

// Get campaign details by id
router.get("/h/campaigns/:campaignId", async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaign = await Donation.find({campaignId});
    
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Get user by ID (used to get donor details)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return only necessary user information
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || null
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get donation summary (total, allocated, remaining)
// Get donation summary endpoint (needed by frontend)
router.get("/summary", async (req, res) => {
  try {
    const summary = await getDonationSummary();
    res.json(summary);
  } catch (error) {
    console.error("Error getting donation summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to get donation summary
async function getDonationSummary() {
  const [donations, allocations] = await Promise.all([
    Donation.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    DonationAllocation.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ])
  ]);
  
  const totalDonations = donations[0]?.total || 0;
  const totalAllocated = allocations[0]?.total || 0;
  
  return {
    total: totalDonations,
    allocated: totalAllocated,
    remaining: totalDonations - totalAllocated
  };
}

// Create a donation allocation
// Create a donation allocation
router.post("/allocate", async (req, res) => {
  try {
    const { allocations, totalCost } = req.body;
    
    // Basic validation
    if (!Array.isArray(allocations) || allocations.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    
    // Check funds availability
    const donationSummary = await getDonationSummary();
    
    if (totalCost > donationSummary.remaining) {
      return res.status(400).json({ 
        message: "Insufficient funds", 
        remaining: donationSummary.remaining, 
        requested: totalCost 
      });
    }
    
    // Find resources by name if needed
    const processedAllocations = [];
    for (const item of allocations) {
      if (!item.resourceType || !item.quantity || !item.unit || !item.cost) {
        return res.status(400).json({ message: "Incomplete allocation data" });
      }
      
      // If resourceType is not a valid ObjectId, try to find it by name
      let resourceTypeId = item.resourceType;
      
      // Check if resourceType is a string but not a valid ObjectId format
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item.resourceType);
      if (!isValidObjectId) {
        // Try to find the resource type by name
        const resourceType = await ResourceType.findOne({ name: item.resourceType });
        if (!resourceType) {
          return res.status(404).json({ message: `Resource type not found: ${item.resourceType}` });
        }
        resourceTypeId = resourceType._id;
      }
      
      processedAllocations.push({
        resourceType: resourceTypeId,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        cost: parseFloat(item.cost),
        description: item.description || ""
      });
    }
    
    // Create and save allocation record
    const allocationRecord = new DonationAllocation({
      allocations: processedAllocations,
      totalCost: parseFloat(totalCost)
    });
    
    await allocationRecord.save();
    
    res.status(201).json({ 
      message: "Donation allocation successful", 
      allocation: allocationRecord 
    });
  } catch (error) {
    console.error("Error allocating donations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/allocations", async (req, res) => {
  try {
    const { startDate, endDate, resourceType } = req.query;
    
    // Build query based on filters
    const query = {};
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set endDate to end of day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }
    
    // Resource type filter
    if (resourceType) {
      try {
        query["allocations.resourceType"] = new mongoose.Types.ObjectId(resourceType);
      } catch (err) {
        console.warn("Invalid ObjectId format for resourceType:", resourceType);
        // If invalid ObjectId, return empty results instead of error
        return res.json([]);
      }
    }
    
    // Execute query with filters
    const allocations = await DonationAllocation.find(query)
      .populate({
        path: 'allocations.resourceType',
        select: 'name category',
        model: 'ResourceType'
      })
      .sort({ createdAt: -1 });
    
    // Transform data to match frontend expectations
    const formattedAllocations = allocations.map(allocation => ({
      id: allocation._id,
      createdAt: allocation.createdAt,
      totalCost: allocation.totalCost,
      allocations: allocation.allocations.map(item => {
        const itemObj = item.toObject ? item.toObject() : item;
        return {
          ...itemObj,
          resourceType: itemObj.resourceType
        };
      })
    }));
    
    res.json(formattedAllocations);
  } catch (error) {
    console.error("Error getting allocation history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get detailed allocation by ID
router.get("/allocation/:id", async (req, res) => {
  try {
    const allocation = await DonationAllocation.findById(req.params.id)
      .populate('allocations.resourceType', 'name category')
      // .populate('admin', 'name email');
    
    if (!allocation) {
      return res.status(404).json({ message: "Allocation record not found" });
    }
    
    res.json(allocation);
  } catch (error) {
    console.error("Error getting allocation details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats/by-resource", async (req, res) => {
  try {
    const stats = await DonationAllocation.aggregate([
      // Unwind the allocations array to work with individual allocation items
      { $unwind: "$allocations" },
      
      // Group by resource type
      { 
        $group: {
          _id: "$allocations.resourceType",
          totalSpent: { $sum: { $multiply: ["$allocations.quantity", "$allocations.cost"] } },
          totalQuantity: { $sum: "$allocations.quantity" },
          count: { $sum: 1 }
        }
      },
      
      // Lookup resource type details
      {
        $lookup: {
          from: "resourcetypes",
          localField: "_id",
          foreignField: "_id",
          as: "resourceTypeInfo"
        }
      },
      
      // Project fields for the response with resource info
      {
        $project: {
          resourceType: { $arrayElemAt: ["$resourceTypeInfo", 0] },
          totalSpent: 1,
          totalQuantity: 1,
          count: 1
        }
      },
      
      // Sort by category first, then by total spent
      { $sort: { "resourceType.category": 1, totalSpent: -1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error("Error getting allocation statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get allocation statistics by month
router.get("/stats/by-month", async (req, res) => {
  try {
    const monthlyStats = await DonationAllocation.aggregate([
      // Group by year and month
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalAllocated: { $sum: "$totalCost" },
          count: { $sum: 1 }
        }
      },
      
      // Format the results for easier consumption
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalAllocated: 1,
          count: 1,
          // Create a date string for sorting (YYYY-MM)
          monthYear: {
            $concat: [
              { $toString: "$_id.year" }, "-",
              { $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
              ]}
            ]
          }
        }
      },
      
      // Sort by date (ascending)
      { $sort: { monthYear: 1 } }
    ]);
    
    res.json(monthlyStats);
  } catch (error) {
    console.error("Error getting monthly statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;

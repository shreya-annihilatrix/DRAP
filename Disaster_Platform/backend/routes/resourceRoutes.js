const express = require('express');
const router = express.Router();
const ResourceType = require('../models/ResourceType');
const ResourceAllocation=require('../models/ResourceAllocation')
const Shelter=require('../models/Shelter')
const Volunteer=require('../models/Volunteer')
const ResourceUsage = require("../models/ResourceUsage");
const User = require('../models/user');

// @route   POST /api/resourceTypes/add
// @desc    Add a new resource type
// @access  Admin only
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the resource type already exists
    let existingResource = await ResourceType.findOne({ name });
    if (existingResource) {
      return res.status(400).json({ message: 'Resource type already exists' });
    }

    const resource = new ResourceType({ name });
    await resource.save();
    res.status(201).json({ message: 'Resource type added successfully', resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resourceTypes/list
// @desc    Get all resource types
// @access  Public
router.get('/list', async (req, res) => {
  try {
    const resources = await ResourceType.find();
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// @route   DELETE /api/resourceTypes/delete/:id
// @desc    Delete a resource type
// @access  Admin only
router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedResource = await ResourceType.findByIdAndDelete(id);
      if (!deletedResource) {
        return res.status(404).json({ message: "Resource type not found" });
      }
      res.status(200).json({ message: "Resource type deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  


  // Get all shelters for dropdown
router.get("/shelters", async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (error) {
    console.error("Error fetching shelters:", error);
    res.status(500).json({ error: "Failed to fetch shelters" });
  }
});

// Allocate resources to a shelter
router.post("/allocate", async (req, res) => {
  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const { shelter, resources } = req.body;
    
    // Create allocation without calculating amountPerUnit
    const allocation = new ResourceAllocation({
      shelter: shelter,
      resources: resources
    });
    
    await allocation.save();
    res.status(201).json({ message: "Resources allocated successfully!" });
  } catch (error) {
    console.error("Error allocating resources:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Add this to your existing routes file, e.g., routes/resourceTypes.js

// Get all allocations for a specific shelter
router.get("/allocations/:shelterId", async (req, res) => {
  try {
    const { shelterId } = req.params;
    
    // Find all allocations for the given shelter and populate resourceType details
    const allocations = await ResourceAllocation.find({ shelter: shelterId })
      .populate({
        path: 'resources.resourceType',
        select: 'name category'
      })
      .populate({
        path: 'shelter',
        select: 'location'
      })
      .sort({ createdAt: -1 }); // Sort by most recent first
    
    res.json(allocations);
  } catch (error) {
    console.error("Error fetching allocations:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Get shelter assigned to a volunteer
// Get shelter assigned to a volunteer (based on userId)
router.get("/shelter-assigned/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find volunteer using userId
    const volunteer = await Volunteer.findOne({ userId: userId });

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Fetch assigned shelter using volunteer ID
    const shelter = await Shelter.findOne({ assignedVolunteer: volunteer._id });

    if (!shelter) {
      return res.status(404).json({ message: "No shelter assigned to this volunteer" });
    }

    res.json(shelter);
  } catch (error) {
    console.error("Error fetching assigned shelter:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

const ContributedResource = require("../models/ContributedResource");
// Add a new contribution (multiple resources in an array)
router.post("/add-contribution", async (req, res) => {
  try {
      const { resources, shelter, contributorName, contributorContact, contributorId } = req.body;

      // // Log the received data for debugging
      // console.log("Received contribution data:", {
      //     resources,
      //     shelter,
      //     contributorName,
      //     contributorContact,
      //     contributorId
      // });

      if (!resources || resources.length === 0 || !shelter || !contributorName || !contributorContact) {
          return res.status(400).json({ message: "All required fields must be filled!" });
      }

      // Create the contribution object, handling the contributorId properly
      const newContribution = new ContributedResource({
          resources,
          shelter,
          contributorName,
          contributorContact,
          // Only add contributorId if it's not null/undefined
          ...(contributorId && { contributorId }),
          status: 0 // Default is pending
      });

      // Log the contribution object before saving
      console.log("Contribution document to be saved:", newContribution);

      await newContribution.save();
      res.status(201).json({ 
          message: "Contribution submitted successfully!", 
          contribution: newContribution 
      });
  } catch (error) {
      console.error("Error adding contribution:", error);
      res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Get all contributions with populated data (enhanced version)
router.get("/contributions", async (req, res) => {
  try {
    const contributions = await ContributedResource.find()
      .populate({
        path: 'shelter',
        select: 'location'
      })
      .populate({
        path: 'resources.resourceType',
        select: 'name category'
      })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(contributions);
  } catch (error) {
    console.error("Error fetching all contributions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve contribution (Admin action)
router.put("/approve-contribution/:id", async (req, res) => {
    try {
        const contribution = await ContributedResource.findById(req.params.id);
        if (!contribution) {
            return res.status(404).json({ message: "Contribution not found." });
        }

        contribution.status = 1; // Mark as verified
        await contribution.save();

        res.json({ message: "Contribution approved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});


router.get('/user-contributions/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all contributions without trying to convert userId to ObjectId
    const contributions = await ContributedResource.find({ contributorId: userId })
    .populate({
      path: 'resources.resourceType',
      select: 'name category'
    })
    .populate({
      path: 'shelter',
      select: 'location'
    })
      .sort({ createdAt: -1 });
    
    // Log what we found to help with debugging
    console.log(`Found ${contributions.length} contributions for user ${userId}`);
    
    res.status(200).json(contributions);
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get("/shelter-contributions/:shelterId", async (req, res) => {
  try {
    const { shelterId } = req.params;
    
    const contributions = await ContributedResource.find({ shelter: shelterId })
      .populate({
        path: 'resources.resourceType',
        select: 'name category'
      })
      .populate({
        path: 'shelter',
        select: 'location'
      })
      .sort({ createdAt: -1 }); // Sort by most recent first
    
    res.json(contributions);
  } catch (error) {
    console.error("Error fetching shelter contributions:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

router.post('/add-usage', async (req, res) => {
  try {
    console.log(req.body);
    const { shelter, resources, notes, userId } = req.body;
    
    // Verify shelter exists
    const shelterExists = await Shelter.findById(shelter);
    if (!shelterExists) {
      return res.status(404).json({ msg: 'Shelter not found' });
    }
    
    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Verify all resource types exist
    for (const resource of resources) {
      const resourceTypeExists = await ResourceType.findById(resource.resourceType);
      if (!resourceTypeExists) {
        return res.status(404).json({ 
          msg: `Resource type with ID ${resource.resourceType} not found` 
        });
      }
    }
    
    // Create new usage record
    const newResourceUsage = new ResourceUsage({
      shelter,
      volunteer: userId,
      resources: resources.map(r => ({
        resourceType: r.resourceType,
        quantity: r.quantity,
        unit: r.unit,
        description: r.description
      })),
      notes
    });
    
    await newResourceUsage.save();
    res.json(newResourceUsage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// // Get all resource usage records for a specific volunteer
// router.get("/volunteer", auth, async (req, res) => {
//   try {
//       const usageRecords = await ResourceUsage.find({ volunteer: req.user.id })
//           .populate("resources.resourceType", "name")
//           .populate("shelter", "location name")
//           .sort({ createdAt: -1 });
          
//       res.json(usageRecords);
//   } catch (err) {
//       console.error("Error fetching volunteer's usage records:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Get all resource usage records for a specific shelter
// router.get("/shelter/:shelterId", auth, async (req, res) => {
//   try {
//       const usageRecords = await ResourceUsage.find({ shelter: req.params.shelterId })
//           .populate("resources.resourceType", "name")
//           .populate("volunteer", "name")
//           .sort({ createdAt: -1 });
          
//       res.json(usageRecords);
//   } catch (err) {
//       console.error("Error fetching shelter usage records:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// Get volunteer by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.params.userId });
    
    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer record not found' });
    }
    
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Get shelters assigned to a volunteer
router.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const shelters = await Shelter.find({ 
      assignedVolunteer: req.params.volunteerId 
    });
    
    res.json(shelters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// Simplified resource types router

router.get("/shelters/owner/:ownerId", async (req, res) => {
  try {
    const shelter = await Shelter.findOne({ owner: req.params.ownerId });
    if (!shelter) return res.status(404).json({ message: "No shelter found for this owner" });
    res.json(shelter);
  } catch (error) {
    console.error("Error fetching shelter by owner:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/usage/:shelterId", async (req, res) => {
  try {
    const { shelterId } = req.params;
    const { startDate, endDate, resourceType } = req.query;
    
    const query = { shelter: shelterId };
    
    // Add date filters if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }
    
    // Add resource type filter if provided
    if (resourceType) query["resources.resourceType"] = resourceType;
    
    const usageRecords = await ResourceUsage.find(query)
      .populate('resources.resourceType', 'name category')
      .populate('volunteer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(usageRecords);
  } catch (error) {
    console.error("Error fetching usage records:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/usage/record/:id", async (req, res) => {
  try {
    const usageRecord = await ResourceUsage.findById(req.params.id)
      .populate('resources.resourceType', 'name category')
      .populate('volunteer', 'name email')
      .populate('shelter', 'location contactDetails');
    
    if (!usageRecord) return res.status(404).json({ message: "Usage record not found" });
    res.json(usageRecord);
  } catch (error) {
    console.error("Error fetching usage record:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/usage/:id", async (req, res) => {
  try {
    const { resources, notes } = req.body;
    const updatedRecord = await ResourceUsage.findByIdAndUpdate(
      req.params.id,
      { resources, notes },
      { new: true }
    );
    
    if (!updatedRecord) return res.status(404).json({ message: "Usage record not found" });
    res.json(updatedRecord);
  } catch (error) {
    console.error("Error updating usage record:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/usage/:id", async (req, res) => {
  try {
    const deletedRecord = await ResourceUsage.findByIdAndDelete(req.params.id);
    if (!deletedRecord) return res.status(404).json({ message: "Usage record not found" });
    res.json({ message: "Resource usage record deleted successfully" });
  } catch (error) {
    console.error("Error deleting usage record:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/usage/summary/:shelterId", async (req, res) => {
  try {
    const resourceSummary = await ResourceUsage.aggregate([
      { $match: { shelter: mongoose.Types.ObjectId(req.params.shelterId) } },
      { $unwind: "$resources" },
      { 
        $group: {
          _id: "$resources.resourceType",
          totalUsed: { $sum: "$resources.quantity" }
        }
      },
      {
        $lookup: {
          from: "resourcetypes",
          localField: "_id",
          foreignField: "_id",
          as: "resourceTypeInfo"
        }
      },
      {
        $project: {
          resourceType: { $arrayElemAt: ["$resourceTypeInfo", 0] },
          totalUsed: 1
        }
      },
      { $sort: { "resourceType.name": 1 } }
    ]);
    
    res.json(resourceSummary);
  } catch (error) {
    console.error("Error generating usage summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Route to get all shelters (for admin use)
router.get("/all", async (req, res) => {
  try {
    const shelters = await Shelter.find({})
      .populate('assignedVolunteer')
      .sort({ location: 1 });
    
    // If you need volunteer user details too
    const populatedShelters = await Promise.all(shelters.map(async (shelter) => {
      if (shelter.assignedVolunteer) {
        // Get the user info for the assigned volunteer
        const volunteerWithUser = await Volunteer.findById(shelter.assignedVolunteer._id)
          .populate('userId', 'name email phone');
        
        // Create a new object with volunteer user data
        const shelterObj = shelter.toObject();
        shelterObj.volunteerUser = volunteerWithUser ? volunteerWithUser.userId : null;
        return shelterObj;
      }
      return shelter;
    }));
    
    res.json(populatedShelters);
  } catch (error) {
    console.error("Error fetching all shelters:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

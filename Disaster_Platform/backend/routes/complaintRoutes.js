const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Create a new complaint
router.post("/report", async (req, res) => {
  try {
    const { userId, complaintType, description } = req.body;

    // Validate required fields
    if (!userId || !complaintType || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create new complaint
    const complaint = new Complaint({
      userId,
      complaintType,
      description,
      // reportedId and createdAt will be handled by the model defaults
    });

    // Save complaint to database
    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint reported successfully",
      complaintId: complaint.reportedId,
    });
  } catch (error) {
    console.error("Error reporting complaint:", error);
    res.status(500).json({
      success: false,
      message: "Failed to report complaint",
      error: error.message,
    });
  }
});

// Get all complaints for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
});

// Get a specific complaint by reportedId
// router.get("/:reportedId", async (req, res) => {
//   try {
//     const complaint = await Complaint.findOne({ reportedId: req.params.reportedId });

//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: "Complaint not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       complaint,
//     });
//   } catch (error) {
//     console.error("Error fetching complaint:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch complaint",
//       error: error.message,
//     });
//   }
// });

// IMPORTANT: The order of routes matters! 
// These specific routes must come before the /:reportedId route to be matched correctly

// Update the backend routes/complaint.js to fix the filter endpoint
router.get("/filter", async (req, res) => {
    try {
      const { startDate, endDate, status } = req.query;
      const query = {};
  
      // Add date range filter if provided
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          // Set time to end of day for endDate
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          query.createdAt.$lte = endDateTime;
        }
      }
  
      // Add status filter if provided
      if (status !== undefined && status !== "") {
        // Convert numeric status to string status
        const statusMap = {
          "0": "Pending",
          "1": "Under Review",
          "2": "Resolved",
          "3": "Dismissed"
        };
        
        if (statusMap[status]) {
          query.status = statusMap[status];
        }
      }
  
      const complaints = await Complaint.find(query)
        .sort({ createdAt: -1 })
        .populate("userId", "name email");
  
      // Transform data to match frontend expectations
      const transformedComplaints = complaints.map(complaint => {
        // Convert status string to number for frontend
        const statusMap = {
          "Pending": 0,
          "Under Review": 1,
          "Resolved": 2,
          "Dismissed": 3
        };
        
        return {
          _id: complaint._id,
          subject: complaint.complaintType,
          description: complaint.description,
          name: complaint.userId ? complaint.userId.name : "Unknown",
          email: complaint.userId ? complaint.userId.email : "Unknown",
          status: statusMap[complaint.status] || 0,
          adminResponse: complaint.adminComments,
          responseDate: complaint.updatedAt,
          createdAt: complaint.createdAt
        };
      });
  
      // Send direct array format as expected by the frontend
      res.status(200).json(transformedComplaints);
    } catch (error) {
      console.error("Error filtering complaints:", error);
      res.status(500).json({
        success: false,
        message: "Failed to filter complaints",
        error: error.message,
      });
    }
  });
  
  // Also fix the /all endpoint the same way
  router.get("/all", async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name email");
      
      // Transform data to match frontend expectations
      const transformedComplaints = complaints.map(complaint => {
        // Convert status string to number for frontend
        const statusMap = {
          "Pending": 0,
          "Under Review": 1,
          "Resolved": 2,
          "Dismissed": 3
        };
        
        return {
          _id: complaint._id,
          subject: complaint.complaintType,
          description: complaint.description,
          name: complaint.userId ? complaint.userId.name : "Unknown",
          email: complaint.userId ? complaint.userId.email : "Unknown",
          status: statusMap[complaint.status] || 0,
          adminResponse: complaint.adminComments,
          responseDate: complaint.updatedAt,
          createdAt: complaint.createdAt
        };
      });
      
      // Send direct array format as expected by the frontend
      res.status(200).json(transformedComplaints);
    } catch (error) {
      console.error("Error fetching all complaints:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch complaints",
        error: error.message,
      });
    }
  });
  
  // Fix the /respond endpoint
  router.post("/respond", async (req, res) => {
    try {
      const { complaintId, adminId, response, status } = req.body;
  
      if (!complaintId || !response) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }
  
      // Map status codes from frontend to model enum values
      const statusMap = {
        "0": "Pending",
        "1": "Under Review", 
        "2": "Resolved",
        "3": "Dismissed"
      };
  
      // Find complaint by MongoDB _id
      const complaint = await Complaint.findById(complaintId);
      
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found"
        });
      }
  
      // Update complaint with admin response
      complaint.adminComments = response;
      complaint.status = statusMap[status] || "Under Review";
      complaint.updatedAt = Date.now();
  
      const updatedComplaint = await complaint.save();
      
      // Transform the response to match frontend expectations
      const responseStatusMap = {
        "Pending": 0,
        "Under Review": 1,
        "Resolved": 2,
        "Dismissed": 3
      };
      
      const transformedComplaint = {
        _id: updatedComplaint._id,
        subject: updatedComplaint.complaintType,
        description: updatedComplaint.description,
        status: responseStatusMap[updatedComplaint.status] || 1,
        adminResponse: updatedComplaint.adminComments,
        responseDate: updatedComplaint.updatedAt,
        createdAt: updatedComplaint.createdAt
      };
      
      res.status(200).json({
        success: true,
        message: "Response submitted successfully",
        complaint: transformedComplaint
      });
    } catch (error) {
      console.error("Error responding to complaint:", error);
      res.status(500).json({
        success: false,
        message: "Failed to respond to complaint",
        error: error.message
      });
    }
  });

// Get all complaints (administrative default route)
router.get("/", async (req, res) => {
  try {
    // Add filter options
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.complaintType) {
      filter.complaintType = req.query.complaintType;
    }
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
});

// Update complaint status (for admin)
router.patch("/:reportedId", async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    const updatedComplaint = await Complaint.findOneAndUpdate(
      { reportedId: req.params.reportedId },
      { status, adminComments, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update complaint",
      error: error.message,
    });
  }
});

// Get complaint statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = {
      total: await Complaint.countDocuments(),
      pending: await Complaint.countDocuments({ status: "Pending" }),
      underReview: await Complaint.countDocuments({ status: "Under Review" }),
      resolved: await Complaint.countDocuments({ status: "Resolved" }),
      dismissed: await Complaint.countDocuments({ status: "Dismissed" })
    };
    
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching complaint statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint statistics",
      error: error.message,
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');
const Volunteer = require("../models/Volunteer");
const User= require("../models/user");
const multer = require("multer");
const nodemailer = require("nodemailer");

// ✅ Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Add Shelter and Update Assigned Volunteer Task Status
router.post("/add", async (req, res) => {
    try {
        const { location, latitude, longitude, totalCapacity, contactDetails, assignedVolunteer } = req.body;

        // ✅ Step 1: Create and save the shelter
        const newShelter = new Shelter({
            location,
            latitude,
            longitude,
            totalCapacity,
            inmates: 0, // Default inmates count
            contactDetails,
            assignedVolunteer
        });

        await newShelter.save();
        console.log("✅ Shelter created successfully!");

        // ✅ Step 2: Update taskStatus of the assigned volunteer
        if (assignedVolunteer) {
            await Volunteer.findByIdAndUpdate(assignedVolunteer, { taskStatus: 1 });
            console.log(`✅ Volunteer ${assignedVolunteer} taskStatus updated to 1`);
        }

        res.status(201).json({ message: "✅ Shelter added successfully!" });

    } catch (error) {
        console.error("❌ Error adding shelter:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get all shelters with populated volunteer details
router.get("/view", async (req, res) => {
  try {
      const shelters = await Shelter.find().lean();

      const sheltersWithVolunteers = await Promise.all(
          shelters.map(async (shelter) => {
              if (!shelter.assignedVolunteer) {
                  return { ...shelter, volunteer: null };
              }

              // Fetch the volunteer details
              const volunteer = await Volunteer.findById(shelter.assignedVolunteer).lean();
              if (!volunteer) return { ...shelter, volunteer: null };

              // If taskStatus is 1, show "Volunteer approval waiting"
              if (volunteer.taskStatus === 1) {
                  return { ...shelter, volunteer: { approvalStatus: "Volunteer approval waiting", taskStatus: 1 } };
              }

              // If taskStatus is 3, show "Volunteer Rejected the Task"
              if (volunteer.taskStatus === 3) {
                  return { ...shelter, volunteer: { approvalStatus: "Volunteer Rejected the Task", taskStatus: 3 } };
              }

              // Fetch user details from users collection
              const user = await User.findById(volunteer.userId).lean();
              return {
                  ...shelter,
                  volunteer: user
                      ? { name: user.name, email: user.email, phone: user.phone, taskStatus: volunteer.taskStatus }
                      : null,
              };
          })
      );

      res.json(sheltersWithVolunteers);
  } catch (error) {
      console.error("❌ Error fetching shelters:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


  

// ✅ Update shelter inmates count (updated by assigned volunteer)
router.put('/update-inmates/:id', async (req, res) => {
    try {
        const { inmates } = req.body;
        const shelter = await Shelter.findById(req.params.id);
        if (!shelter) return res.status(404).json({ message: 'Shelter not found' });

        if (inmates > shelter.totalCapacity) {
            return res.status(400).json({ message: 'Inmates count cannot exceed total capacity' });
        }

        shelter.inmates = inmates;
        await shelter.save();
        res.json({ message: '✅ Inmates count updated successfully!' });
    } catch (error) {
        console.error("❌ Error updating inmates count:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ Delete Shelter and Reset Volunteer Task Status
router.delete("/delete/:shelterId", async (req, res) => {
    try {
        const { shelterId } = req.params;
        const shelter = await Shelter.findById(shelterId);

        if (!shelter) {
            return res.status(404).json({ error: "❌ Shelter not found!" });
        }

        // ✅ Reset volunteer's taskStatus to 0
        if (shelter.assignedVolunteer) {
            await Volunteer.findByIdAndUpdate(shelter.assignedVolunteer, { taskStatus: 0 });
            console.log(`✅ Volunteer ${shelter.assignedVolunteer} taskStatus reset to 0`);
        }

        // ✅ Delete the shelter
        await Shelter.findByIdAndDelete(shelterId);

        res.json({ message: "✅ Shelter deleted and volunteer task status reset!" });
    } catch (error) {
        console.error("❌ Error deleting shelter:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//list assigned shelters
// router.get("/assigned-shelters/:volunteerId", async (req, res) => {
//   try {
//       const { volunteerId } = req.params;

//       // Find shelters assigned to this volunteer
//       const shelters = await Shelter.find({ assignedVolunteer: volunteerId });

//       res.json(shelters);
//   } catch (error) {
//       res.status(500).json({ message: "Server Error", error });
//   }
// });


router.get("/assigned-shelters/:volunteerId", async (req, res) => {
  try {
      const { volunteerId } = req.params;

      // Find assigned shelters for the given volunteer
      const shelters = await Shelter.find({ assignedVolunteer: volunteerId });

      // Fetch taskStatus from the volunteers collection
      const volunteer = await Volunteer.findById(volunteerId);
      const taskStatus = volunteer ? volunteer.taskStatus : null;
      console.log(taskStatus)

      res.json({ shelters, taskStatus });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error });
  }
});

//to accept or decline task
// router.put("/update-task/:shelterId/:volunteerId", async (req, res) => {
//   try {
//       const { shelterId, volunteerId } = req.params;
//       const { taskStatus } = req.body;

//       // Ensure taskStatus is either 2 (Accepted) or 3 (Rejected)
//       if (![2, 3].includes(taskStatus)) {
//           return res.status(400).json({ message: "Invalid task status" });
//       }

//       // Update taskStatus in the volunteers collection
//       await Volunteer.findByIdAndUpdate(volunteerId, { taskStatus });

//       res.json({ message: `Task ${taskStatus === 2 ? "accepted" : "rejected"} successfully` });
//   } catch (error) {
//       res.status(500).json({ message: "Server Error", error });
//   }
// });

// Update your route to accept status 4
router.put("/update-task/:shelterId/:volunteerId", async (req, res) => {
  try {
      const { shelterId, volunteerId } = req.params;
      const { taskStatus } = req.body;

      // Update to include status 4 (Completed)
      if (![2, 3, 4].includes(taskStatus)) {
          return res.status(400).json({ message: "Invalid task status" });
      }

      // Update taskStatus in the volunteers collection
      await Volunteer.findByIdAndUpdate(volunteerId, { taskStatus });

      let statusMessage = "";
      if (taskStatus === 2) statusMessage = "accepted";
      else if (taskStatus === 3) statusMessage = "rejected";
      else if (taskStatus === 4) statusMessage = "completed";

      res.json({ message: `Task ${statusMessage} successfully` });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/volunteer-id/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const volunteer = await Volunteer.findOne({ userId });

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json({ volunteerId: volunteer._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET accepted shelter for a specific volunteer (taskStatus === 2)
router.get("/accepted/:volunteerId", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    
    // Find all shelters assigned to this volunteer
    const shelters = await Shelter.find({ assignedVolunteer: volunteerId }).lean();

    // Get the volunteer's details once
    const volunteer = await Volunteer.findById(volunteerId).lean();
    if (!volunteer) {
      return res.json([]);
    }

    // Get the user details for the volunteer
    const user = await User.findById(volunteer.userId).lean();

    // Filter and map shelters
    const acceptedShelters = shelters.map((shelter) => {
      return {
        ...shelter,
        taskStatus: volunteer.taskStatus, // Include taskStatus in the response
        volunteer: user ? { 
          name: user.name, 
          email: user.email, 
          phone: user.phone 
        } : null,
      };
    }).filter(shelter => volunteer.taskStatus === 2 || volunteer.taskStatus === 4); // Only accepted (2) or completed (4) shelters

    console.log("Returning shelters:", acceptedShelters); // Debug log
    res.json(acceptedShelters);
  } catch (error) {
    console.error("Error fetching accepted shelters:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  // Get nearby shelters within a specified radius (km)
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        
        // Convert latitude and longitude to numbers
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const searchRadius = parseFloat(radius) || 10; // Default 10km
        
        // Basic validation
        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ message: "Invalid latitude or longitude" });
        }
        
        // Find all shelters (we'll filter by distance in JavaScript)
        const allShelters = await Shelter.find({}).populate('assignedVolunteer');

        
        
        // Calculate distance using the Haversine formula
        const nearbyShelters = allShelters.filter(shelter => {
            const distance = calculateDistance(
                userLat, userLng,
                shelter.latitude, shelter.longitude
            );
            return distance <= searchRadius;
        });
        
        return res.json(nearbyShelters);
    } catch (error) {
        console.error("Error finding nearby shelters:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}
  

// Send shelter directions via email
router.post('/send-directions', async (req, res) => {
    try {
      const { shelterName, shelterAddress, userEmail, shelterLat, shelterLng } = req.body;
      
      // Basic validation
      if (!userEmail || !shelterName) {
        return res.status(400).json({ message: "Email and shelter information required" });
      }
  
      // Generate Google Maps directions URL - this URL will use the person's 
      // current location when they open it
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shelterLat},${shelterLng}&travelmode=driving`;
      
      // Create email with directions
      const mailOptions = {
        from: `"Disaster Relief Platform" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Directions to ${shelterName} Shelter`,
        html: `
          <h2>Directions to ${shelterName}</h2>
          <p>Address: ${shelterAddress}</p>
          <p>When you open the link below, it will provide directions from your current location to the shelter:</p>
          <p><a href="${directionsUrl}" target="_blank" style="background-color: #2196f3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">Open Directions in Google Maps</a></p>
          <p>You can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${directionsUrl}</p>
          <p>Stay safe!</p>
          <p>Best Regards,<br>
          Disaster Relief Assistance Team</p>
        `,
      };
  
      // Send email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Email Error:", err);
          return res.status(500).json({ message: "Error sending email" });
        } else {
          console.log("Directions Email Sent: " + info.response);
          return res.status(200).json({ message: "Directions sent to your email successfully" });
        }
      });
    } catch (error) {
      console.error("Error sending directions:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Volunteer = require("../models/Volunteer");
const nodemailer = require("nodemailer");

const router = express.Router();

// Email Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = re
  q.body;

  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to Verify Admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.adminId = decoded.adminId;
    next();
  });
};

// Get Pending Volunteers (Without Authentication)
router.get("/pending-volunteers", async (req, res) => {
  try {
    // Fetch only volunteers whose application is still pending
    const pendingVolunteers = await Volunteer.find({ applicationStatus: 0 }).populate("userId");

    res.json(pendingVolunteers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Approve/Reject Volunteers
router.post("/approve-volunteer", async (req, res) => {
  const { volunteerId, applicationStatus } = req.body;
  console.log(req.body);

  try {
    const volunteer = await Volunteer.findById(volunteerId).populate("userId");
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    volunteer.applicationStatus = applicationStatus;
    await volunteer.save();

    // Send Email Notification
    const emailMessage = applicationStatus === 1
      ? "Your volunteer application has been approved! You can now log in."
      : "Your volunteer application has been rejected.";

    await transporter.sendMail({
      from: '"Disaster Relief" <drap7907@gmail.com>',
      to: volunteer.userId.email,
      subject: "Volunteer Application Status",
      text: emailMessage,
    });

    res.json({ message: `Volunteer ${applicationStatus === 1 ? "approved" : "rejected"}` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Get Accepted Volunteers
router.get("/accepted-volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ applicationStatus: 1 }).populate("userId");
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching accepted volunteers" });
  }
});

// Get Rejected Volunteers
router.get("/rejected-volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ applicationStatus: 2 }).populate("userId");
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rejected volunteers" });
  }
});

// Delete Rejected Volunteer (Fixes issue with User deletion)
router.delete("/delete-volunteer/:id", async (req, res) => {
  try {
    const volunteerId = req.params.id;

    // Find the volunteer first to get the associated userId
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    // Delete volunteer entry
    await Volunteer.findByIdAndDelete(volunteerId);

    // Delete corresponding user entry using userId
    await User.findByIdAndDelete(volunteer.userId);

    res.json({ message: "Volunteer and User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting volunteer and user" });
  }
});

module.exports = router;

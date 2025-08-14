const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Volunteer = require("../models/Volunteer");
const Public = require("../models/Public");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Fetching volunteers for shelter management
router.get("/available-volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ 
      taskStatus: 0, // Available for assignment
      skills: { $in: ["Shelter Management"] }, // Must have 'Shelter Management' skill
      applicationStatus: 1 // Approved by admin
    }).lean();

    const userIds = volunteers.map(v => v.userId);
    const users = await User.find({ _id: { $in: userIds } });

    const availableVolunteers = volunteers.map(v => ({
      ...v,
      userDetails: users.find(u => u._id.toString() === v.userId.toString()) || {}
    }));

    res.json(availableVolunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Error fetching available volunteers" });
  }
});

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// File Upload Setup with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, or PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Enhanced Signup API Route
router.post("/signup", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "experienceCertificate", maxCount: 1 }
]), async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const { name, email, password, phone, address, age, role, skills } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !address || !age || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check if files exist
    if (!req.files || !req.files["photo"]) {
      return res.status(400).json({ error: "Profile photo is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      age,
      role,
      photo: req.files["photo"][0].path,
      isApproved: role !== "volunteer",
    });

    await user.save();

    if (role === "volunteer") {
      // Validate required volunteer files
      if (!req.files["idProof"]) {
        // Cleanup uploaded files if validation fails
        if (req.files["photo"]) {
          fs.unlinkSync(req.files["photo"][0].path);
        }
        return res.status(400).json({ error: "ID proof is required for volunteers" });
      }

      // Build volunteer data
      const volunteerData = {
        userId: user._id,
        skills,
        idProof: req.files["idProof"][0].path,
      };

      // Add experience certificate if provided
      if (req.files["experienceCertificate"]) {
        volunteerData.experienceCertificate = req.files["experienceCertificate"][0].path;
      }

      await new Volunteer(volunteerData).save();

      // Send Email Notification to Volunteer
      const mailOptions = {
        from: `"Disaster Relief Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Volunteer Application Received - Awaiting Approval",
        html: `
          <h3>Hello ${name},</h3>
          <p>Thank you for signing up as a volunteer on our platform.</p>
          <p>Your application is currently under review by an admin. You will receive another email once your application is approved.</p>
          <p>We appreciate your willingness to help in disaster relief efforts.</p>
          <p>Best Regards,<br>Disaster Relief Assistance Team</p>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Email Error:", err);
        } else {
          console.log("Email Sent: " + info.response);
        }
      });
    } else {
      await new Public({ userId: user._id }).save();
    }

    res.status(201).json({ 
      message: "Signup successful!",
      details: role === "volunteer" ? "Please wait for admin approval" : "You can now login"
    });
  } catch (error) {
    console.error("Signup Error:", error);
    
    // Cleanup uploaded files if error occurs
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        });
      });
    }

    // Handle specific errors
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    
    res.status(500).json({ 
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
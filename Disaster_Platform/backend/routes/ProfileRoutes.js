const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized access. Please log in." });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  });
};

// Set up storage for Multer (Profile Photo Upload)
const storage = multer.diskStorage({
  destination: "uploads/", // Store images in 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, req.userId + path.extname(file.originalname)); // Unique filename (UserID + Extension)
  },
});

const upload = multer({ storage });

// Get Profile (Including Photo)
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    // Append full image URL
    const profilePhotoUrl = user.photo ? `http://localhost:5000/${user.photo}` : null;
    res.json({ ...user.toObject(), profilePhotoUrl });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile." });
  }
});

// Update Profile Photo
// Update Profile Photo Route
router.put("/update-photo", upload.single("photo"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    // Update User Profile Photo
    const updatedUser = await User.findByIdAndUpdate(
      userId, // Get userId from request body
      { photo: req.file.path },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found." });

    res.json({ 
      message: "Profile photo updated successfully!", 
      profilePhotoUrl: `http://localhost:5000/${updatedUser.photo}` 
    });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    res.status(500).json({ message: "Error updating profile photo." });
  }
});

// Edit Profile
router.put("/edit/:userId", async (req, res) => {
  try {
    const { name, phone, address, age } = req.body;

    // Validate input fields
    if (!name || !phone || !address || !age) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, phone, address, age },
      { new: true } // Return updated user data
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile." });
  }
});

// Change Password Route
router.put("/change-password", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    console.log("Change Password Request Received:", { userId, oldPassword, newPassword });

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found." });
    }

    console.log("Stored Hashed Password:", user.password);

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log("Incorrect old password.");
      return res.status(400).json({ message: "Incorrect old password." });
    }

    // Ensure new password is at least 6 characters long
    if (!newPassword || newPassword.length < 6) {
      console.log("New password is too short.");
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update only the password field
    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    console.log("Password updated successfully.");
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password.", error: error.message });
  }
});

module.exports = router;

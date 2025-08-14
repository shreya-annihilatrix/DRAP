const express = require("express");
const router = express.Router();
const Inmate = require("../models/Inmate");
const Shelter = require("../models/Shelter");

// Add an inmate to a shelter
router.post("/shelters/:shelterId/inmates", async (req, res) => {
  try {
    const { shelterId } = req.params;
    const { name, place, age, contact } = req.body;
    
    const inmate = new Inmate({ name, place, age, contact, shelterId });
    await inmate.save();
    
    // Increment the inmate count in the shelter document
    await Shelter.findByIdAndUpdate(shelterId, { $inc: { inmates: 1 } });
    
    res.json({ message: "Inmate added successfully", inmate });
  } catch (error) {
    console.error("Error adding inmate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all inmates for a shelter
router.get("/shelters/:shelterId/inmates", async (req, res) => {
  try {
    const { shelterId } = req.params;
    const inmates = await Inmate.find({ shelterId });
    res.json(inmates);
  } catch (error) {
    console.error("Error fetching inmates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an inmate and update shelter inmate count
router.delete("/shelters/:inmateId", async (req, res) => {
  try {
    const { inmateId } = req.params;
    const inmate = await Inmate.findById(inmateId);
    if (!inmate) {
      return res.status(404).json({ error: "Inmate not found" });
    }
    const shelterId = inmate.shelterId;
    // Delete the inmate document
    await Inmate.findByIdAndDelete(inmateId);
    // Decrement the inmates count in the Shelter
    await Shelter.findByIdAndUpdate(shelterId, { $inc: { inmates: -1 } });
    res.json({ message: "Inmate deleted successfully" });
  } catch (error) {
    console.error("Error deleting inmate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;

const express = require("express");
const Skill = require("../models/skill");

const router = express.Router();

// ✅ Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add a new skill
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) return res.status(400).json({ error: "Skill name is required" });

    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) return res.status(400).json({ error: "Skill already exists" });

    const skill = new Skill({ name });
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update a skill
router.put("/:id", async (req, res) => {
  const { name } = req.body;

  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    skill.name = name;
    await skill.save();

    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a skill
router.delete("/:id", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const protect  = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// simple dashboard stats
router.get("/dashboard", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const User = require("../models/User");

    const students = await User.countDocuments({ role: "student" });
    const teachers = await User.countDocuments({ role: "teacher" });
    const parents = await User.countDocuments({ role: "parent" });

    res.json({
      students,
      teachers,
      parents,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
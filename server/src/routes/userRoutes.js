const express = require("express");
const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { role } = req.query;

      const filter = role ? { role } : {};

      const users = await User.find(filter).select("-password");

      res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// =======================
// ADMIN DASHBOARD
// =======================
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin Panel",
    user: req.user,
  });
});

// =======================
// TEACHER ACCESS
// =======================
router.get(
  "/teacher",
  protect,
  authorizeRoles("admin", "teacher"),
  (req, res) => {
    res.json({
      message: "Welcome Teacher Panel",
      user: req.user,
    });
  }
);

// =======================
// PROFILE (ALL USERS)
// =======================
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User Profile",
    user: req.user,
  });
});

// =======================
// 🔥 NEW: UNIVERSAL USERS API (NO FRONTEND CHANGE)
// =======================
// This fixes your Classes.jsx WITHOUT changing API calls
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-password");

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
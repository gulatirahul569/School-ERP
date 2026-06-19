const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ONLY ADMIN CAN ACCESS
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin Panel",
    user: req.user,
  });
});

// ADMIN + TEACHER CAN ACCESS
router.get("/teacher", protect, authorizeRoles("admin", "teacher"), (req, res) => {
  res.json({
    message: "Welcome Teacher Panel",
    user: req.user,
  });
});

// ALL LOGGED-IN USERS
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User Profile",
    user: req.user,
  });
});

module.exports = router;
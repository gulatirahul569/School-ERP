const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// =======================
// TEACHER DASHBOARD
// =======================
router.get(
  "/dashboard",
  protect,
  authorizeRoles("teacher"),
  (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message: "Teacher dashboard loaded",
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
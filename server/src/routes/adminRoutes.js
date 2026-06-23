const express = require("express");
const router = express.Router();

const {
  getAdminDashboardStats,
} = require("../controllers/adminDashboardController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ==============================
// ADMIN DASHBOARD (FULL)
// ==============================
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

module.exports = router;
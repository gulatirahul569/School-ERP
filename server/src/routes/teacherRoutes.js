
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getTeacherDashboard,
} = require("../controllers/teacherController");

router.get(
  "/dashboard",
  protect,
  authorizeRoles("teacher"),
  getTeacherDashboard
);

module.exports = router;
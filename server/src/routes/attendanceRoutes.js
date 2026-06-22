const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
  getClassAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Teacher marks attendance
router.post(
  "/mark",
  protect,
  authorizeRoles("teacher"),
  markAttendance
);

// Student view
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentAttendance
);

// Teacher view
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("teacher", "admin"),
  getClassAttendance
);

module.exports = router;
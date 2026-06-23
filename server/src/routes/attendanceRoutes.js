const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getClassAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Teacher marks attendance
router.post(
  "/mark",
  protect,
  authorizeRoles("teacher", "admin"),
  markAttendance
);

// Student attendance
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentAttendance
);

// Attendance by class + date
router.get(
  "/by-date",
  protect,
  authorizeRoles("teacher", "admin"),
  getAttendanceByDate
);

// Full class attendance history
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("teacher", "admin"),
  getClassAttendance
);

module.exports = router;
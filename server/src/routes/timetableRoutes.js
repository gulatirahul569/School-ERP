const express = require("express");
const router = express.Router();

const {
  createOrUpdateTimetable,
  getClassTimetable,
  getMyTimetable,
} = require("../controllers/timetableController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ➜ ADMIN creates/updates timetable
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createOrUpdateTimetable
);


// ➜ GET timetable of a class (admin/teacher)
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("admin", "teacher"),
  getClassTimetable
);


// ➜ STUDENT gets own timetable
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyTimetable
);

module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Apply protection + role check to ALL student routes
router.use(protect);
router.use(authorizeRoles("student"));

/**
 * 📅 STUDENT TIMETABLE
 */
router.get("/timetable", (req, res) => {
  res.json({
    message: "Student Timetable",
    timetable: [
      {
        day: "Monday",
        subjects: ["Math", "Science", "English"],
      },
      {
        day: "Tuesday",
        subjects: ["History", "Math", "Computer"],
      },
      {
        day: "Wednesday",
        subjects: ["Physics", "Chemistry", "PT"],
      },
    ],
  });
});

/**
 * 📊 STUDENT RESULTS
 */
router.get("/results", (req, res) => {
  res.json({
    message: "Student Results",
    exam: "Mid Term",
    subjects: [
      { name: "Math", marks: 90 },
      { name: "Science", marks: 85 },
      { name: "English", marks: 88 },
    ],
    percentage: 87.6,
    grade: "A",
  });
});

/**
 * 📌 STUDENT ATTENDANCE
 */
router.get("/attendance", (req, res) => {
  res.json({
    message: "Student Attendance",
    totalClasses: 100,
    present: 90,
    absent: 10,
    percentage: 90,
  });
});

/**
 * 📢 ANNOUNCEMENTS
 */
router.get("/announcements", (req, res) => {
  res.json([
    {
      title: "School Closed Tomorrow",
      description: "Due to heavy rain alert",
    },
    {
      title: "Mid Term Exam Schedule",
      description: "Exams start from next Monday",
    },
    {
      title: "Fee Reminder",
      description: "Last date for fee submission is 25th",
    },
  ]);
});

module.exports = router;
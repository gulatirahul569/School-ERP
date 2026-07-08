const express = require("express");
const router = express.Router();

const {
  markResult,
  getResultBySheet,
  getClassResults,
  getStudentResults,
} = require("../controllers/resultControllers");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Teacher marks/updates a result sheet (class + subject + exam)
router.post(
  "/mark",
  protect,
  authorizeRoles("teacher", "admin"),
  markResult
);

// Student's own results
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentResults
);

// Load a specific result sheet (class + subject + exam) for editing
router.get(
  "/by-sheet",
  protect,
  authorizeRoles("teacher", "admin"),
  getResultBySheet
);

// Full result history for a class
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("teacher", "admin"),
  getClassResults
);

module.exports = router;
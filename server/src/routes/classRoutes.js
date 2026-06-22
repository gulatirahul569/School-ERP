const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  getClassById,
  assignStudentToClass,
  removeStudentFromClass,
  deleteClass,   // 👈 ADD THIS
} = require("../controllers/classController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// =======================
// CLASS CRUD
// =======================
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createClass
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getClasses
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  getClassById
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteClass
);

// =======================
// STUDENT ASSIGNMENT
// =======================
router.post(
  "/assign-student",
  protect,
  authorizeRoles("admin"),
  assignStudentToClass
);

router.post(
  "/remove-student",
  protect,
  authorizeRoles("admin"),
  removeStudentFromClass
);

module.exports = router;
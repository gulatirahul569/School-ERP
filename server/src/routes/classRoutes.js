const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  getClassById,
  assignStudentToClass,
  removeStudentFromClass,
  deleteClass,
  getMyClasses,
  assignTeacherToClass,
  removeTeacherFromClass,
} = require("../controllers/classController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// =====================================================
// ⚠️ IMPORTANT: SPECIFIC ROUTES MUST COME BEFORE "/:id"
// =====================================================

// =======================
// TEACHER - MY CLASSES
// =======================
router.get(
  "/my-classes",
  protect,
  authorizeRoles("teacher"),
  getMyClasses
);

// =======================
// CLASS CRUD (ADMIN)
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

// =======================
// GET CLASS BY ID (ADMIN + TEACHER)
// =======================


router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  getClassById
);


// =======================
// DELETE CLASS
// =======================
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteClass
);

// =======================
// STUDENT ASSIGNMENT (ADMIN)
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

// =======================
// TEACHER ASSIGNMENT (ADMIN)
// =======================
router.post(
  "/assign-teacher",
  protect,
  authorizeRoles("admin"),
  assignTeacherToClass
);

router.post(
  "/remove-teacher",
  protect,
  authorizeRoles("admin"),
  removeTeacherFromClass
);

module.exports = router;
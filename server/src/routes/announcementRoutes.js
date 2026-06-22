const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ➜ CREATE (ADMIN / TEACHER)
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  createAnnouncement
);

// ➜ GET (ALL USERS)
router.get(
  "/",
  protect,
  getAnnouncements
);

// ➜ DELETE (ADMIN ONLY)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteAnnouncement
);

module.exports = router;
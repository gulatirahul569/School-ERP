const express = require("express");
const router = express.Router();

const {
  setClassFee,
  getClassFees,
  getStudentFees,
  markFeePaid,
  deleteFee,
} = require("../controllers/feeController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/class/:classId/set", protect, authorizeRoles("admin"), setClassFee);
router.get("/class/:classId", protect, authorizeRoles("admin", "teacher"), getClassFees);
router.get("/student/:studentId", protect, authorizeRoles("admin", "teacher", "student"), getStudentFees);
router.put("/:feeId/pay", protect, authorizeRoles("admin"), markFeePaid);
router.delete("/:feeId", protect, authorizeRoles("admin"), deleteFee);

module.exports = router;
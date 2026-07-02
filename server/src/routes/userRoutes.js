const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// =======================
// ADMIN: CREATE USER (student / teacher / parent)
// =======================
// Only an admin can hit this route. This replaces the old public
// /api/auth/register — admin gives out the login credentials instead
// of people signing themselves up.
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      classId,
      phone,
      dateOfBirth,
      address,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "name, email, password and role are required",
      });
    }

    const allowedRoles = ["student", "teacher", "parent"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      classId: classId || null,
      phone: phone || "",
      dateOfBirth: dateOfBirth || null,
      address: address || "",
    });

    const { password: _omit, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { role } = req.query;

      const filter = role ? { role } : {};

      const users = await User.find(filter).select("-password");

      res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// =======================
// ADMIN DASHBOARD
// =======================
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin Panel",
    user: req.user,
  });
});

// =======================
// TEACHER ACCESS
// =======================
router.get(
  "/teacher",
  protect,
  authorizeRoles("admin", "teacher"),
  (req, res) => {
    res.json({
      message: "Welcome Teacher Panel",
      user: req.user,
    });
  }
);

// =======================
// PROFILE (ALL USERS)
// =======================
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User Profile",
    user: req.user,
  });
});

// =======================
// 🔥 NEW: UNIVERSAL USERS API (NO FRONTEND CHANGE)
// =======================
// This fixes your Classes.jsx WITHOUT changing API calls
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-password");

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
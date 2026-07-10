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
      subjects,
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
      subjects: subjects || [],
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
// ADMIN: UPDATE USER (student / teacher / parent)
// =======================
// Lets admin fix wrong details after creation. Password is optional here -
// only touched if the admin actually typed a new one.
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      classId,
      phone,
      dateOfBirth,
      address,
      isActive,
      subjects,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If email is being changed, make sure it's not already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "A user with this email already exists",
        });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth || null;
    if (address !== undefined) user.address = address;
    if (classId !== undefined) user.classId = classId || null;
    if (isActive !== undefined) user.isActive = isActive;
    if (subjects !== undefined) user.subjects = subjects;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const { password: _omit, ...userWithoutPassword } = user.toObject();

    res.json({
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =======================
// ADMIN: DELETE USER
// =======================
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

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
// req.user (set by the auth middleware) only carries a trimmed subset of
// fields, so we re-fetch the full record here - this is what makes phone,
// dateOfBirth, address, etc. (the details an admin fills in) show up on
// the student's own profile page.
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("classId", "name section");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User Profile",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
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
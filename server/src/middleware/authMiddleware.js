const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ FIX: normalize user object (VERY IMPORTANT)
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      classId: user.classId || null, // 🔥 THIS FIXES YOUR ISSUE
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};

module.exports = protect;
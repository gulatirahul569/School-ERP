const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const classRoutes = require("./routes/classRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();
const authRoutes = require("./routes/authRoutes");

// connect database
connectDB();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES AFTER
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/class", classRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
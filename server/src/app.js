const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

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

module.exports = app;
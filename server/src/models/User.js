const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      required: true,
    },

    // Student belongs to one class
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },

    // Optional profile fields
    phone: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
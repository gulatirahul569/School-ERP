const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    date: {
      type: String, // "2026-01-22"
      required: true,
    },

    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        status: {
          type: String,
          enum: ["present", "absent"],
          default: "present",
        },
      },
    ],

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
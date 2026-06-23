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
attendanceSchema.index(
  {
    classId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);
module.exports = mongoose.model("Attendance", attendanceSchema);
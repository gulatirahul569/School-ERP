const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },

    periods: [
      {
        subject: String,

        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
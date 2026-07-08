const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    examType: {
      type: String, // e.g. "Unit Test 1", "Mid Term", "Final Term"
      required: true,
      trim: true,
    },

    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },

    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        marksObtained: {
          type: Number,
          default: 0,
        },

        remarks: {
          type: String,
          default: "",
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

// One result sheet per class + subject + exam - re-saving updates it
// instead of creating a duplicate (same pattern as Attendance).
resultSchema.index(
  {
    classId: 1,
    subject: 1,
    examType: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);
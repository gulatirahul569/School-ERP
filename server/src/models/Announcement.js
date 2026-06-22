const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    // who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // optional: if announcement is for a specific class
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },

    // global or class-specific
    type: {
      type: String,
      enum: ["global", "class"],
      default: "global",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
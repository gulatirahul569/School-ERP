const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rollNumber: String,

    className: String,

    section: String,

    phone: String,

    address: String,

    parentName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
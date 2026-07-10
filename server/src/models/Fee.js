const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    month: {
      type: String,
      required: true, // e.g. "April"
    },
    year: {
      type: Number,
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paidOn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One record per student per month per year
feeSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Fee", feeSchema);
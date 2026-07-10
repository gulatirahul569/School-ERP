const Class = require("../models/Class");
const Fee = require("../models/Fee");
const {
  ACADEMIC_MONTHS,
  getAcademicYear,
  getCurrentSessionStartYear,
} = require("../utils/academicMonths");

// Creates/refreshes the 12 monthly fee records for one student, based on
// the class's current totalFee. Existing records only get amountDue
// refreshed — amountPaid/paidOn are left alone so recorded payments
// are never wiped out.
const generateFeesForStudent = async (studentId, classData) => {
  const monthlyAmount =
    Math.round(((classData.totalFee || 0) / 12) * 100) / 100;
  const sessionStartYear = getCurrentSessionStartYear();

  const ops = ACADEMIC_MONTHS.map((month) => {
    const year = getAcademicYear(month, sessionStartYear);
    return Fee.findOneAndUpdate(
      { studentId, month, year },
      {
        $set: { amountDue: monthlyAmount, classId: classData._id },
        $setOnInsert: { studentId, month, year, amountPaid: 0, paidOn: null },
      },
      { upsert: true, new: true }
    );
  });

  await Promise.all(ops);
};

// =======================
// ADMIN: SET CLASS TOTAL FEE (splits it across the academic year)
// =======================
exports.setClassFee = async (req, res) => {
  try {
    const { classId } = req.params;
    const { totalFee } = req.body;

    if (totalFee === undefined || Number(totalFee) < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid totalFee is required",
      });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    classData.totalFee = Number(totalFee);
    await classData.save();

    await Promise.all(
      classData.students.map((studentId) =>
        generateFeesForStudent(studentId, classData)
      )
    );

    res.json({
      success: true,
      message: "Class fee set and monthly records generated",
      data: classData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// ADMIN + TEACHER (own class only): ALL STUDENTS' FEE STATUS FOR A CLASS
// =======================
exports.getClassFees = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findById(classId).populate(
      "students",
      "name email phone"
    );

    if (!classData) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (
      req.user.role === "teacher" &&
      String(classData.classTeacher) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not the class teacher for this class",
      });
    }

    const fees = await Fee.find({ classId }).sort({ year: 1 });

    const byStudent = classData.students.map((student) => {
      const studentFees = fees.filter(
        (f) => String(f.studentId) === String(student._id)
      );
      const totalDue = studentFees.reduce((sum, f) => sum + f.amountDue, 0);
      const totalPaid = studentFees.reduce((sum, f) => sum + f.amountPaid, 0);

      return {
        student,
        fees: studentFees,
        totalDue,
        totalPaid,
        balance: Math.max(totalDue - totalPaid, 0),
      };
    });

    res.json({
      success: true,
      data: {
        classId: classData._id,
        className: classData.name,
        section: classData.section,
        totalFee: classData.totalFee,
        students: byStudent,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// ADMIN + TEACHER + THE STUDENT THEMSELVES: ONE STUDENT'S FEE HISTORY
// =======================
exports.getStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;

    const isSelf = String(req.user._id) === String(studentId);
    if (!isSelf && !["admin", "teacher"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const fees = await Fee.find({ studentId }).sort({ year: 1 });

    // Order April-first (academic order) instead of insertion order
    const ordered = ACADEMIC_MONTHS.map((month) =>
      fees.find((f) => f.month === month)
    ).filter(Boolean);

    const totalDue = ordered.reduce((sum, f) => sum + f.amountDue, 0);
    const totalPaid = ordered.reduce((sum, f) => sum + f.amountPaid, 0);

    res.json({
      success: true,
      data: {
        fees: ordered,
        totalDue,
        totalPaid,
        balance: Math.max(totalDue - totalPaid, 0),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// ADMIN: UPDATE A FEE RECORD (due amount and/or paid amount)
// =======================
exports.markFeePaid = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { amountPaid, amountDue } = req.body;

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee record not found" });
    }

    if (amountDue !== undefined) {
      if (Number(amountDue) < 0) {
        return res.status(400).json({ success: false, message: "amountDue cannot be negative" });
      }
      fee.amountDue = Number(amountDue);
    }

    if (amountPaid !== undefined) {
      if (Number(amountPaid) < 0) {
        return res.status(400).json({ success: false, message: "amountPaid cannot be negative" });
      }
      fee.amountPaid = Number(amountPaid);
      // Resetting to 0 should clear the paid date instead of leaving a stale one
      fee.paidOn = fee.amountPaid > 0 ? new Date() : null;
    }

    await fee.save();

    res.json({ success: true, message: "Fee record updated", data: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// ADMIN: DELETE A FEE RECORD
// =======================
exports.deleteFee = async (req, res) => {
  try {
    const { feeId } = req.params;

    const fee = await Fee.findByIdAndDelete(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee record not found" });
    }

    res.json({ success: true, message: "Fee record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports._generateFeesForStudent = generateFeesForStudent;
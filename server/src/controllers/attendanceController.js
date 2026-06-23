const Attendance = require("../models/Attendance");
const Class = require("../models/Class");

/**
 * Mark or Update Attendance
 */
exports.markAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    if (!classId || !date || !records) {
      return res.status(400).json({
        message: "classId, date and records are required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    const existingAttendance = await Attendance.findOne({
      classId,
      date,
    });

    if (existingAttendance) {
      existingAttendance.records = records;
      existingAttendance.markedBy = req.user._id;

      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      classId,
      date,
      records,
      markedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Attendance For Logged In Student
 */
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attendance = await Attendance.find({
      "records.student": studentId,
    })
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Complete Attendance History Of Class
 */
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;

    const attendance = await Attendance.find({
      classId,
    })
      .populate("records.student", "name email")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Attendance By Class + Date
 */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        message: "classId and date are required",
      });
    }

    const attendance = await Attendance.findOne({
      classId,
      date,
    }).populate("records.student", "name email");

    if (!attendance) {
      return res.status(200).json({
        success: true,
        records: [],
      });
    }

    return res.status(200).json({
      success: true,
      attendance,
      records: attendance.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
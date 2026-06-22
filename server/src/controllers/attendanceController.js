const Attendance = require("../models/Attendance");
const Class = require("../models/Class");

exports.markAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    // check class exists
    const classData = await Class.findById(classId).populate("students");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const attendance = await Attendance.create({
      classId,
      date,
      records,
      markedBy: req.user._id,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const data = await Attendance.find({
      "records.student": studentId,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;

    const data = await Attendance.find({ classId }).populate(
      "records.student",
      "name email"
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
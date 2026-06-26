const Timetable = require("../models/Timetable");
const Class = require("../models/Class");


// ➜ CREATE / UPDATE TIMETABLE (Admin only)
exports.createOrUpdateTimetable = async (req, res) => {
  try {
    const { classId, day, periods } = req.body;

    let timetable = await Timetable.findOne({ classId, day });

    if (timetable) {
      timetable.periods = periods.map((p) => ({
        periodNo: p.periodNo,   // ✅ FIXED
        subject: p.subject,
        teacher: p.teacher,
        startTime: p.startTime,
        endTime: p.endTime,
      }));

      await timetable.save();

      return res.json({ message: "Updated", data: timetable });
    }

    timetable = await Timetable.create({
      classId,
      day,
      periods: periods.map((p) => ({
        periodNo: p.periodNo,   // ✅ FIXED
        subject: p.subject,
        teacher: p.teacher,
        startTime: p.startTime,
        endTime: p.endTime,
      })),
    });

    res.status(201).json({ message: "Created", data: timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ➜ GET TIMETABLE BY CLASS (Student/Teacher/Admin)
exports.getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;

    const timetable = await Timetable.find({ classId })
      .populate("periods.teacher", "name email")
      .sort({ day: 1 });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ➜ GET MY TIMETABLE (Student login)
exports.getMyTimetable = async (req, res) => {
  try {
    const classId = req.user.classId;

    if (!classId) {
      return res.status(400).json({ message: "No class assigned" });
    }

    const timetable = await Timetable.find({ classId })
      .populate("periods.teacher", "name email");

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTeacherTimetable = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const timetable = await Timetable.find({
      "periods.teacher": teacherId,
    })
      .populate("classId", "name section")
      .populate("periods.teacher", "name email")
      .sort({ day: 1 });

    // IMPORTANT: filter only teacher's periods
    const filtered = timetable.map((t) => ({
      _id: t._id,
      classId: t.classId,
      day: t.day,
      periods: t.periods.filter(
        (p) => String(p.teacher?._id) === String(teacherId)
      ),
    }));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
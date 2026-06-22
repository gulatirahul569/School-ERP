const Timetable = require("../models/Timetable");
const Class = require("../models/Class");


// ➜ CREATE / UPDATE TIMETABLE (Admin only)
exports.createOrUpdateTimetable = async (req, res) => {
  try {
    const { classId, day, periods } = req.body;

    // check class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // check if timetable already exists for class + day
    let timetable = await Timetable.findOne({ classId, day });

    if (timetable) {
      // update existing
      timetable.periods = periods;
      await timetable.save();

      return res.json({
        message: "Timetable updated",
        data: timetable,
      });
    }

    // create new
    timetable = await Timetable.create({
      classId,
      day,
      periods,
    });

    res.status(201).json({
      message: "Timetable created",
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
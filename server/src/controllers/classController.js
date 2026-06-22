const Class = require("../models/Class");
const User = require("../models/User");


// =======================
// CREATE CLASS
// =======================
exports.createClass = async (req, res) => {
  try {
    const { name, section } = req.body;

    if (!name || !section) {
      return res.status(400).json({
        success: false,
        message: "Name and section are required",
      });
    }

    const existing = await Class.findOne({
      name: name.trim(),
      section: section.trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Class already exists",
      });
    }

    const newClass = await Class.create({
      name: name.trim(),
      section: section.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// =======================
// GET ALL CLASSES
// =======================
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("students", "name email") // 👈 THIS IS REQUIRED
      .sort({ createdAt: -1 });

    res.json({
      data: classes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// GET CLASS BY ID
// =======================
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("classTeacher", "name email role")
      .populate("students", "name email role");

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================
// ASSIGN STUDENT TO CLASS
// =======================
exports.assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "Invalid student",
      });
    }

    // prevent duplicate assignment
    const alreadyExists = classData.students.some(
      (id) => id.toString() === studentId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Student already assigned to this class",
      });
    }

    // sync both sides
    classData.students.push(studentId);
    await classData.save();

    student.classId = classId;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Student assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================
// REMOVE STUDENT FROM CLASS
// =======================
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    classData.students = classData.students.filter(
      (id) => id.toString() !== studentId
    );

    await classData.save();

    await User.findByIdAndUpdate(studentId, {
      classId: null,
    });

    res.status(200).json({
      success: true,
      message: "Student removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // remove class reference from students
    await User.updateMany(
      { classId: classId },
      { $unset: { classId: "" } }
    );

    await Class.findByIdAndDelete(classId);

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
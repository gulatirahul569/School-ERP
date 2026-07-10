const Class = require("../models/Class");
const User = require("../models/User");
const { _generateFeesForStudent: generateFeesForStudent } = require("./feeController");

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
      students: [],
      classTeacher: null,
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
      .populate("students", "name email classId")
      .populate("classTeacher", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// GET CLASS BY ID
// =======================
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("students", "name email role classId")
      .populate("classTeacher", "name email role");

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
// ASSIGN STUDENT
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

    const alreadyExists = classData.students.some(
      (id) => id.toString() === studentId,
    );

    if (!alreadyExists) {
      classData.students.push(studentId);
    }

    student.classId = classId;

    await classData.save();
    await student.save();
    if (classData.totalFee > 0) {
      await generateFeesForStudent(studentId, classData);
    }

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
// REMOVE STUDENT
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
      (id) => id.toString() !== studentId,
    );

    await classData.save();

    await User.findByIdAndUpdate(studentId, {
      $unset: { classId: "" },
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

// =======================
// ASSIGN CLASS TEACHER
// =======================
exports.assignTeacherToClass = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher",
      });
    }

    classData.classTeacher = teacherId;

    await classData.save();

    res.status(200).json({
      success: true,
      message: "Teacher assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// REMOVE CLASS TEACHER
// =======================
exports.removeTeacherFromClass = async (req, res) => {
  try {
    const { classId } = req.body;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    classData.classTeacher = null;

    await classData.save();

    res.status(200).json({
      success: true,
      message: "Teacher removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET MY CLASSES (Teacher)
// =======================
exports.getMyClasses = async (req, res) => {
  try {

    const classes = await Class.find({
      classTeacher: req.user._id,
    })
      .populate("students", "name email")
      .populate("classTeacher", "name email");

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// DELETE CLASS
// =======================
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

    // Remove class reference from students
    await User.updateMany({ classId: classId }, { $unset: { classId: "" } });

    await Class.findByIdAndDelete(classId);

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

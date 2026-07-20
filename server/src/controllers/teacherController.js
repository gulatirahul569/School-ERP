const Timetable = require("../models/Timetable");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Find all timetable entries for this teacher
    const timetables = await Timetable.find({
      "periods.teacher": teacherId,
    });

    console.log("Logged in Teacher:", teacherId);
    console.log("Timetables Found:", JSON.stringify(timetables, null, 2));
    const classSet = new Set();
    const subjectSet = new Set();

    timetables.forEach((tt) => {
      tt.periods.forEach((period) => {
        if (String(period.teacher) === String(teacherId)) {
          classSet.add(String(tt.classId));
          subjectSet.add(period.subject);
        }
      });
    });

    const classIds = [...classSet];

    // Total Classes
    const classes = classIds.length;

    // Total Students
    const students = await User.countDocuments({
      role: "student",
      classId: { $in: classIds },
    });

    // Get teacher profile
    const teacher = await User.findById(teacherId).select("subjects");

    // Total subjects assigned by admin
    const totalSubjects = teacher?.subjects?.length || 0;

    // Today's Attendance
    const today = new Date().toISOString().split("T")[0];

    const attendanceDocs = await Attendance.find({
      classId: { $in: classIds },
      date: today,
    });

    let present = 0;
    let total = 0;

    attendanceDocs.forEach((doc) => {
      doc.records.forEach((record) => {
        total++;

        if (record.status === "present") {
          present++;
        }
      });
    });

    const attendance = total === 0 ? 0 : Math.round((present / total) * 100);

    return res.json({
      classes,
      students,
      attendance,
      totalSubjects,
      subjectList: teacher?.subjects || [],

      teacher: {
        name: teacher.name,
        email: teacher.email,
        subjects: teacher.subjects,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const User = require("../models/User");

// ==============================
// ADMIN DASHBOARD STATS
// ==============================
exports.getAdminDashboardStats = async (req, res) => {
  try {
    // today in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // ONLY attendance marked for today
    const todayAttendance = await Attendance.find({ date: today });

    let presentToday = 0;
    let absentToday = 0;

    const classStatsMap = {};

    todayAttendance.forEach((att) => {
      const classId = att.classId.toString();

      if (!classStatsMap[classId]) {
        classStatsMap[classId] = {
          classId,
          present: 0,
          absent: 0,
        };
      }

      att.records.forEach((r) => {
        if (r.status === "present") {
          presentToday++; // ONLY real "present today"
          classStatsMap[classId].present++;
        }

        if (r.status === "absent") {
          absentToday++; // ONLY real "absent today"
          classStatsMap[classId].absent++;
        }
      });
    });

    const classes = await Class.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const teachers = await User.countDocuments({ role: "teacher" });
    const parents = await User.countDocuments({ role: "parent" });

    res.json({
      students,
      teachers,
      parents,
      classes,

      presentToday,
      absentToday,

      classWiseAttendance: Object.values(classStatsMap),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

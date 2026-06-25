import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [timetable, setTimetable] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tRes = await axios.get("/timetable/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimetable(tRes.data || []);

        const aRes = await axios.get("/announcement", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(aRes.data?.data)
          ? aRes.data.data
          : Array.isArray(aRes.data)
          ? aRes.data
          : [];

        setAnnouncements(list);

        const atRes = await axios.get("/attendance/student", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAttendance(atRes.data?.stats || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= TODAY LOGIC =================
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const timetableMap = {};

  timetable.forEach((dayData) => {
    const map = {};
    dayData.periods?.forEach((p) => {
      map[p.periodNo] = p;
    });
    timetableMap[dayData.day] = map;
  });

  const todayPeriods = timetableMap[today];

  const attendanceRate = attendance?.percentage || 0;

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl shadow-md">
        <h1 className="text-3xl font-bold">
          Student Dashboard 🎓
        </h1>
        <p className="text-white/80 mt-1">
          Overview of your academic activity
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-indigo-100 rounded-3xl p-6">
          <p className="text-indigo-600 text-sm">Attendance</p>
          <h2 className="text-4xl font-bold mt-2">
            {attendanceRate}%
          </h2>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6">
          <p className="text-yellow-700 text-sm">Status</p>
          <h2 className="text-3xl font-bold mt-2">
            {attendanceRate >= 75 ? "Good 👍" : "Improve ⚠️"}
          </h2>
        </div>

        <div className="bg-indigo-100 rounded-3xl p-6">
          <p className="text-indigo-600 text-sm">Classes</p>
          <h2 className="text-4xl font-bold mt-2">
            {timetable.length}
          </h2>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6">
          <p className="text-yellow-700 text-sm">Announcements</p>
          <h2 className="text-4xl font-bold mt-2">
            {announcements.length}
          </h2>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT - TODAY TIMETABLE */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm ">

          {/* HEADER + VIEW ALL */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              📅 Today's Timetable ({today})
            </h2>

            <Link
              to="/student/timetable"
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              View All →
            </Link>
          </div>

          {!todayPeriods ? (
            <p className="text-gray-500">No classes today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full  text-sm">

                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Period</th>
                    <th className="p-3 border">Subject</th>
                    <th className="p-3 border">Teacher</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.values(todayPeriods)
                    .sort((a, b) => a.periodNo - b.periodNo)
                    .map((p, i) => (
                      <tr key={i} className="text-center">

                        <td className="p-3 border font-semibold">
                          {p.periodNo}
                        </td>

                        <td className="p-3 border">
                          {p.subject}
                        </td>

                        <td className="p-3 border text-gray-600">
                          {p.teacher?.name || "Teacher"}
                        </td>

                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* DATE */}
          <div className="bg-white rounded-3xl p-6 shadow-sm ">
            <h2 className="font-semibold">Today</h2>
            <p className="text-gray-500 mt-2">
              {new Date().toDateString()}
            </p>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm ">

            {/* HEADER + VIEW ALL */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                📢 Announcements
              </h2>

              <Link
                to="/student/announcements"
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                View All →
              </Link>
            </div>

            {announcements.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No announcements
              </p>
            ) : (
              <div className="space-y-3">

                {announcements.slice(0, 4).map((a) => (
                  <div
                    key={a._id}
                    className="border rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-sm">
                      {a.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {a.message}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-2">
                      {a.type === "global"
                        ? "Global"
                        : "Class"}
                    </p>
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
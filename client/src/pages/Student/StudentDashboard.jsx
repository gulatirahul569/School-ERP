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
  <div className="space-y-4 sm:space-y-6 p-3 sm:p-2 sm:pt-0">
    {/* HEADER */}
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Student Dashboard
        </h1>

        <p className="text-gray-500 mt-1 text-sm">
          Welcome back, Student 👋
        </p>
      </div>
    </div>

    {/* KPI CARDS */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
        <div className="bg-indigo-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0">
          📊
        </div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Attendance</p>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {attendanceRate}%
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
        <div className="bg-yellow-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0">
          {attendanceRate >= 75 ? "👍" : "⚠️"}
        </div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Status</p>

          <h2 className="text-base sm:text-xl font-bold text-gray-800">
            {attendanceRate >= 75 ? "Good" : "Improve"}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
        <div className="bg-indigo-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0">
          📅
        </div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Periods</p>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {timetable.length}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
        <div className="bg-yellow-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0">
          📢
        </div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Announcements
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {announcements.length}
          </h2>
        </div>
      </div>
    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* LEFT */}
      <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 bg-gray-100 pl-3 pr-3 p-1 rounded-2xl">
          <h2 className="text-lg sm:text-xl font-semibold">
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
          <p className="text-gray-600 text-sm">
            No classes today
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-100 w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="p-2 sm:p-3 text-left font-medium">
                    Period
                  </th>

                  <th className="p-2 sm:p-3 text-left font-medium">
                    Subject
                  </th>

                  <th className="p-2 sm:p-3 text-left font-medium">
                    Teacher
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {Object.values(todayPeriods)
                  .sort((a, b) => a.periodNo - b.periodNo)
                  .map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-2 sm:p-3 font-semibold text-gray-800">
                        {p.periodNo}
                      </td>

                      <td className="p-2 sm:p-3 text-gray-700">
                        {p.subject}
                      </td>

                      <td className="p-2 sm:p-3 text-gray-500">
                        {p.teacher?.name || "Teacher"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="space-y-4 sm:space-y-6">
        {/* DATE */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="font-semibold text-base sm:text-lg text-gray-800">
            Today
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            {new Date().toDateString()}
          </p>
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 bg-gray-100 pl-3 pr-3 rounded-2xl">
            <h2 className="font-semibold text-base sm:text-lg text-gray-800">
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
              {announcements.slice(0, 2).map((a) => (
                <div
                  key={a._id}
                  className="border border-gray-100 rounded-xl p-3 sm:p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-sm sm:text-base">
                    {a.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {a.message}
                  </p>

                  <p className="text-[10px] text-gray-400 mt-2">
                    {a.type === "global" ? "Global" : "Class"}
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
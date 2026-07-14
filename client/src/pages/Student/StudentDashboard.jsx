import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Bell,
  CircleCheck,
  CircleAlert,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

const StudentDashboard = () => {
  const [timetable, setTimetable] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  // ================= CLASS STATUS =================
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentClass = null;
  let nextClass = null;
  let classStatus = "";

  if (todayPeriods) {
    const periods = Object.values(todayPeriods).sort(
      (a, b) => a.periodNo - b.periodNo
    );

    for (const period of periods) {
      const [startHour, startMinute] = period.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = period.endTime
        .split(":")
        .map(Number);

      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      // Current Class
      if (currentMinutes >= start && currentMinutes < end) {
        currentClass = period;

        const remaining = end - currentMinutes;

        if (remaining < 60) {
          classStatus = `Ends in ${remaining} mins`;
        } else {
          const hrs = Math.floor(remaining / 60);
          const mins = remaining % 60;
          classStatus = `Ends in ${hrs}h ${mins}m`;
        }

        break;
      }

      // Upcoming Class
      if (!nextClass && currentMinutes < start) {
        nextClass = period;

        const diff = start - currentMinutes;

        if (diff < 60) {
          classStatus = `Starts in ${diff} mins`;
        } else {
          const hrs = Math.floor(diff / 60);
          const mins = diff % 60;
          classStatus = `Starts in ${hrs}h ${mins}m`;
        }

        break;
      }
    }
  }

  const displayClass = currentClass || nextClass;

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const subjectColors = {
    Mathematics: "bg-blue-100 text-blue-700",
    Science: "bg-green-100 text-green-700",
    English: "bg-yellow-100 text-yellow-700",
    "Computer Science": "bg-purple-100 text-purple-700",
    "Social Studies": "bg-pink-100 text-pink-700",
    "Physical Education": "bg-orange-100 text-orange-700",
  };

  const getSubjectColor = (subject) =>
    subjectColors[subject] || "bg-gray-100 text-gray-700";

  const isCurrentPeriod = (period) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = period.startTime.split(":").map(Number);
    const [eh, em] = period.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    return currentMinutes >= start && currentMinutes < end;
  };


  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
        ? "Good Afternoon"
        : "Good Evening";
  return (
    <div className="space-y-6 pt-0  p-2 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="pb-6 " >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Left */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {user?.name?.split(" ")[0]} 👋
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome back! Here's your academic overview for today.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Right Profile Card */}
          <div className="flex items-center gap-4 bg-gray-100 border border-gray-200 rounded-4xl px-5 py-2">

            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.name || "Student"}
              </h3>

              <p className="text-sm text-gray-500">
                {user?.email}
              </p>


            </div>

          </div>

        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Attendance
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {attendanceRate}%
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Current attendance
              </p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <GraduationCap
                size={24}
                className="text-indigo-600"
              />
            </div>

          </div>
        </div>

        {/* Status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${attendanceRate >= 75
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {attendanceRate >= 75 ? "Good" : "Improve"}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Minimum required: 75%
              </p>
            </div>

            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${attendanceRate >= 75
                ? "bg-green-50"
                : "bg-red-50"
                }`}
            >
              {attendanceRate >= 75 ? (
                <CircleCheck
                  size={24}
                  className="text-green-600"
                />
              ) : (
                <CircleAlert
                  size={24}
                  className="text-red-600"
                />
              )}
            </div>

          </div>
        </div>

        {/* Timetable */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Timetable
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {timetable.length}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Periods Today
              </p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays
                size={24}
                className="text-blue-600"
              />
            </div>

          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Announcements
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {announcements.length}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest updates
              </p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Bell
                size={24}
                className="text-amber-600"
              />
            </div>

          </div>
        </div>

      </div>
      {/* ================= NEXT CLASS ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📚</span>
              <p className="text-sm font-medium text-gray-500">
                {currentClass ? "Current Class" : "Next Class"}
              </p>
            </div>

            {displayClass ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                  {displayClass.subject}
                </h2>

                <p className="mt-1 text-gray-500">
                  Period {displayClass.periodNo}
                </p>
                <p className="mt-1 text-gray-500">
                  👨‍🏫 {displayClass.teacher?.name}
                </p>

                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                  <span>🕒</span>
                  <span>
                    {displayClass.startTime} - {displayClass.endTime}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center mt-5 rounded-full px-3 py-1 text-sm font-medium ${currentClass
                    ? "bg-green-100 text-green-700"
                    : "bg-indigo-100 text-indigo-700"
                    }`}
                >
                  {currentClass && "🟢 "}
                  {classStatus}
                </span>
              </>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  🎉 No More Classes Today
                </h2>

                <p className="mt-2 text-gray-500">
                  You've completed today's schedule.
                </p>
              </div>
            )}
          </div>

          <div className="hidden sm:flex h-14 w-14 rounded-xl bg-indigo-50 items-center justify-center text-2xl">
            📖
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT */}
        {/* ================= TODAY'S TIMETABLE ================= */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Today's Timetable
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {today}
              </p>
            </div>

            <Link
              to="/student/timetable"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
            >
              View All →
            </Link>

          </div>

          {/* Content */}

          {!todayPeriods ? (

            <div className="py-16 flex flex-col items-center justify-center text-center">

              <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                📅
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No Classes Today
              </h3>

              <p className="text-gray-500 mt-1">
                Enjoy your free day!
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 sticky top-0 z-10">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Period
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Subject & Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Teacher
                    </th>

                  </tr>

                </thead>

                <tbody>
                  {Object.values(todayPeriods)
                    .sort((a, b) => a.periodNo - b.periodNo)
                    .map((p) => (
                      <tr
                        key={p.periodNo}
                        className={`border-t transition ${isCurrentPeriod(p)
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        {/* Period */}
                        <td className="px-6 py-2">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                            {p.periodNo}
                          </span>
                        </td>

                        {/* Subject */}
                        <td className="px-6 py-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {p.subject}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {p.startTime} - {p.endTime}
                            </p>
                          </div>
                        </td>

                        {/* Teacher */}
                        <td className="px-6 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">
                              {p.teacher?.name || "Teacher"}
                            </span>

                            {isCurrentPeriod(p) && (
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                LIVE
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* RIGHT */}
        {/* ================= SIDEBAR ================= */}
        <div className="space-y-5">

          {/* Today Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

            

            <div className="p-5">

              <p className="text-lg font-semibold text-gray-900">
                {today}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {new Date().toDateString()}
              </p>

            </div>

          </div>

          {/* Announcements Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

              <h3 className="font-semibold text-gray-900">
                Latest Announcements
              </h3>

              <Link
                to="/student/announcements"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View All →
              </Link>

            </div>

            <div className="p-5">

              {announcements.length === 0 ? (

                <div className="text-center py-8">

                  <p className="text-sm text-gray-500">
                    No announcements available
                  </p>

                </div>

              ) : (

                <div className="space-y-2">

                  {announcements.slice(0, 2).map((a) => (
                    <div
                      key={a._id}
                      className="bg-white border border-gray-200 rounded-2xl pl-4 pr-4 p-2 hover:border-indigo-300 transition"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3">

                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg">
                          {a.createdBy?.name?.charAt(0).toUpperCase() || "A"}
                        </div>

                        {/* Name */}
                        <div className="flex-1">

                          <h4 className="font-semibold text-gray-900">
                            {a.createdBy?.name || "Admin"}
                          </h4>

                          <p className="text-xs text-gray-500 capitalize">
                            {a.createdBy?.role}
                          </p>

                        </div>

                        {/* Date */}
                        <span className="text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>

                      </div>

                      {/* Content */}
                      <div className="mt-1 pl-15 ">

                        <h3 className="font-semibold text-gray-900">
                          {a.title}
                        </h3>

                        <p className="mt-2 text-sm text-gray-600 leading-6 line-clamp-3">
                          {a.message}
                        </p>

                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${a.type === "global"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                            }`}
                        >
                          {a.type === "global" ? "Global" : "Class"}
                        </span>

                        {a.classId && (
                          <span className="text-xs text-gray-500">
                            {a.classId.name} {a.classId.section}
                          </span>
                        )}

                      </div>
                    </div>
                  ))}

                </div>

              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
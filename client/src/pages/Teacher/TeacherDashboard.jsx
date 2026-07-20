import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Bell,
  CircleCheck,
  CircleAlert,
  GraduationCap,
} from "lucide-react";

const TeacherDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Teacher information
  const teacher = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Dashboard Stats
        const dRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/teacher/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setDashboard(dRes.data);

        // Teacher Timetable
        const tRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/timetable/teacher`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTimetable(tRes.data || []);

        // Announcements
        const aRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/announcement`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const list = Array.isArray(aRes.data?.data)
          ? aRes.data.data
          : Array.isArray(aRes.data)
            ? aRes.data
            : [];

        setAnnouncements(list);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ================= GREETING =================

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // ================= TODAY =================

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // ================= TIMETABLE MAP =================

  const timetableMap = {};

  timetable.forEach((dayData) => {
    if (!timetableMap[dayData.day]) {
      timetableMap[dayData.day] = {};
    }

    dayData.periods.forEach((period) => {
      timetableMap[dayData.day][period.periodNo] = {
        ...period,
        classId: dayData.classId,
      };
    });
  });

  const todayPeriods = timetableMap[today];

  // ================= CURRENT / NEXT CLASS =================

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentClass = null;
  let nextClass = null;
  let classStatus = "";

  if (todayPeriods) {
    const periods = Object.values(todayPeriods).sort(
      (a, b) => a.periodNo - b.periodNo,
    );

    for (const period of periods) {
      const [sh, sm] = period.startTime.split(":").map(Number);
      const [eh, em] = period.endTime.split(":").map(Number);

      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      if (currentMinutes >= start && currentMinutes < end) {
        currentClass = period;

        const remaining = end - currentMinutes;

        if (remaining < 60) {
          classStatus = `Ends in ${remaining} mins`;
        } else {
          classStatus = `Ends in ${Math.floor(
            remaining / 60,
          )}h ${remaining % 60}m`;
        }

        break;
      }

      if (!nextClass && currentMinutes < start) {
        nextClass = period;

        const diff = start - currentMinutes;

        if (diff < 60) {
          classStatus = `Starts in ${diff} mins`;
        } else {
          classStatus = `Starts in ${Math.floor(diff / 60)}h ${diff % 60}m`;
        }

        break;
      }
    }
  }

  const displayClass = currentClass || nextClass;

  // ================= CURRENT PERIOD =================

  const isCurrentPeriod = (period) => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = period.startTime.split(":").map(Number);
    const [eh, em] = period.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    return minutes >= start && minutes < end;
  };


  
  // ================= SUBJECT COLORS =================

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

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }


  return (
    <div className="space-y-6 pt-0 p-2 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {teacher?.name?.split(" ")[0]} 👋
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome back! Here's your teaching overview for today.
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

          {/* Profile Card */}
          <div className="flex items-center gap-4 bg-gray-100 border border-gray-200 rounded-3xl px-5 py-3">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
              {teacher?.name?.charAt(0).toUpperCase() || "T"}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {teacher?.name || "Teacher"}
              </h3>

              <p className="text-sm text-gray-500">{teacher?.email}</p>

              <p className="text-xs text-gray-400">Teacher</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* My Classes */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Classes</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {dashboard?.classes || 0}
              </h2>

              <p className="mt-1 text-xs text-gray-400">Assigned classes</p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              🏫
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Students</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {dashboard?.students || 0}
              </h2>

              <p className="mt-1 text-xs text-gray-400">Total students</p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              🎓
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subjects</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {dashboard?.subjects || 0}
              </h2>

              <p className="mt-1 text-xs text-gray-400">Assigned subjects</p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {dashboard?.attendance || 0}%
              </h2>

              <p className="mt-1 text-xs text-gray-400">Today's attendance</p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CircleCheck size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CURRENT / NEXT CLASS ================= */}

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
                  👨‍🎓 {displayClass.classId?.name || "Class"}{" "}
                  {displayClass.classId?.section || ""}
                </p>

                <p className="mt-1 text-gray-500">
                  📍 Room {displayClass.room || "Not Assigned"}
                </p>

                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                  <span>🕒</span>

                  <span>
                    {displayClass.startTime} - {displayClass.endTime}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center mt-5 rounded-full px-3 py-1 text-sm font-medium ${
                    currentClass
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
                  You have completed today's teaching schedule.
                </p>
              </div>
            )}
          </div>

          <div className="hidden sm:flex h-14 w-14 rounded-xl bg-indigo-50 items-center justify-center text-2xl">
            👨‍🏫
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* ================= LEFT ================= */}

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
          {/* Header */}

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Today's Timetable
              </h2>

              <p className="text-sm text-gray-500 mt-1">{today}</p>
            </div>

            <Link
              to="/teacher/timetable"
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

              <p className="text-gray-500 mt-1">Enjoy your free day!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Period
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Subject & Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Class
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.values(todayPeriods)
                    .sort((a, b) => a.periodNo - b.periodNo)
                    .map((period) => (
                      <tr
                        key={period.periodNo}
                        className={`border-t transition ${
                          isCurrentPeriod(period)
                            ? "bg-green-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Period */}

                        <td className="px-6 py-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                            {period.periodNo}
                          </span>
                        </td>

                        {/* Subject */}

                        <td className="px-6 py-3">
                          <div>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getSubjectColor(
                                period.subject,
                              )}`}
                            >
                              {period.subject}
                            </span>

                            <p className="text-sm text-gray-500 mt-2">
                              {period.startTime} - {period.endTime}
                            </p>
                          </div>
                        </td>

                        {/* Class */}

                        <td className="px-6 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {period.classId?.name || "Class"}
                              </p>

                              <p className="text-sm text-gray-500">
                                Section {period.classId?.section || "-"}
                              </p>
                            </div>

                            {isCurrentPeriod(period) && (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
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
        {/* ================= RIGHT SIDEBAR ================= */}

        <div className="space-y-5">
          {/* Today Card */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="p-5">
              <p className="text-lg font-semibold text-gray-900">{today}</p>

              <p className="text-sm text-gray-500 mt-1">
                {new Date().toDateString()}
              </p>
            </div>
          </div>

          {/* ================= ANNOUNCEMENTS ================= */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Latest Announcements
              </h3>

              <Link
                to="/teacher/announcements"
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
                <div className="space-y-3">
                  {announcements.slice(0, 2).map((a) => (
                    <div
                      key={a._id}
                      className="border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 transition"
                    >
                      {/* Header */}

                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                          {a.createdBy?.name?.charAt(0).toUpperCase() || "A"}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {a.createdBy?.name || "Admin"}
                          </h4>

                          <p className="text-xs text-gray-500 capitalize">
                            {a.createdBy?.role}
                          </p>
                        </div>

                        <span className="text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Body */}

                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900">
                          {a.title}
                        </h4>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {a.message}
                        </p>
                      </div>

                      {/* Footer */}

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            a.type === "global"
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

export default TeacherDashboard;

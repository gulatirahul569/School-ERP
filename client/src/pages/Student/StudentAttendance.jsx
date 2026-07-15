import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

import {
  CalendarDays,
  CircleCheck,
  CircleX,
  BarChart3,
  TrendingUp,
  Search,
  Clock3,
} from "lucide-react";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  // Search attendance by date
  const [search, setSearch] = useState("");

  // Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ============================
  // Fetch Attendance
  // ============================

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance/student`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAttendance(res.data.attendance || []);
      setStats(res.data.stats || null);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Attendance Map
  // ============================

  const attendanceMap = {};

  attendance.forEach((item) => {
    attendanceMap[item.date] = item.status;
  });

  // ============================
  // Calendar Tile Color
  // ============================

  const getTileClass = ({ date }) => {
    const d = date.toISOString().split("T")[0];

    if (attendanceMap[d] === "present") {
      return "bg-green-100 text-green-700 rounded-lg";
    }

    if (attendanceMap[d] === "absent") {
      return "bg-red-100 text-red-700 rounded-lg";
    }

    return "";
  };

  // ============================
  // Selected Date
  // ============================

  const selectedDateKey = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;

  const selectedInfo = attendance.find(
    (a) => a.date === selectedDateKey
  );

  const selectedStatus =
    selectedInfo?.status || "not_marked";

  // ============================
  // Search Filter
  // ============================

  const filteredAttendance = useMemo(() => {
    const value = search.trim().toLowerCase();

    let data = attendance;

    if (value) {
      data = attendance.filter((item) => {
        const formattedDate = new Date(item.date)
          .toLocaleDateString("en-GB")
          .toLowerCase();

        const day = new Date(item.date)
          .toLocaleDateString("en-US", {
            weekday: "long",
          })
          .toLowerCase();

        return (
          formattedDate.includes(value) ||
          item.date.toLowerCase().includes(value) ||
          item.status.toLowerCase().includes(value) ||
          day.includes(value)
        );
      });

      return data;
    }

    return showAll ? data : data.slice(0, 5);
  }, [attendance, search, showAll]);

  // ============================
  // Attendance Status
  // ============================

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";

      case "absent":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* Left */}

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Attendance
              </h1>

              <p className="mt-2 text-gray-500">
                Monitor your attendance and stay on track throughout the academic year.
              </p>

            </div>

            {/* Right */}

            <div className="text-right">

              <h2 className="text-3xl font-bold text-indigo-600">
                {attendance.length}
              </h2>

              <p className="text-sm text-gray-500">
                Attendance Records
              </p>

            </div>

          </div>

        </div>

        {/* ================= KPI CARDS ================= */}

        {stats && (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

            {/* Present */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Present
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-green-600">
                    {stats.present}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                  <CircleCheck
                    className="text-green-600"
                    size={24}
                  />

                </div>

              </div>

            </div>

            {/* Absent */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Absent
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-red-600">
                    {stats.absent}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">

                  <CircleX
                    className="text-red-600"
                    size={24}
                  />

                </div>

              </div>

            </div>

            {/* Total */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Total Classes
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {stats.total}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <CalendarDays
                    className="text-indigo-600"
                    size={24}
                  />

                </div>

              </div>

            </div>

            {/* Attendance Rate */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Attendance %
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-blue-600">
                    {stats.percentage}%
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                  <TrendingUp
                    className="text-blue-600"
                    size={24}
                  />

                </div>

              </div>

            </div>

          </div>

        )}



        {/* ================= MAIN CONTENT ================= */}

        {loading ? (

          <div className="grid lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm animate-pulse h-130" />

            <div className="space-y-5">

              <div className="bg-white rounded-2xl h-36 animate-pulse"></div>

              <div className="bg-white rounded-2xl h-52 animate-pulse"></div>

              <div className="bg-white rounded-2xl h-44 animate-pulse"></div>

            </div>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ================= CALENDAR ================= */}

            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Attendance Calendar
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Green = Present • Red = Absent
                  </p>

                </div>

                <CalendarDays
                  className="text-indigo-600"
                  size={26}
                />

              </div>

              <div className="border rounded-xl overflow-hidden h-88">
                <Calendar
                  value={selectedDate}
                  onClickDay={(value) => setSelectedDate(value)}
                  tileClassName={getTileClass}
                  className="attendance-calendar border-none"
                />
              </div>

            </div>

            {/* ================= RIGHT PANEL ================= */}

            <div className="space-y-5">

              {/* TODAY */}

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Today
                    </p>

                    <h2 className="font-semibold text-gray-900 mt-2">
                      {new Date().toDateString()}
                    </h2>

                  </div>

                  <Clock3
                    className="text-indigo-600"
                    size={24}
                  />

                </div>

              </div>

              {/* INSIGHT */}

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="font-semibold text-gray-900">
                    Attendance Insight
                  </h2>

                  <BarChart3
                    size={22}
                    className="text-indigo-600"
                  />

                </div>

                <div className="flex justify-center">

                  <div className="relative w-32 h-32">

                    <svg
                      className="w-32 h-32 -rotate-90"
                      viewBox="0 0 120 120"
                    >

                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        fill="none"
                      />

                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke="#4f46e5"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={327}
                        strokeDashoffset={
                          327 -
                          (327 * stats.percentage) / 100
                        }
                      />

                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                      <span className="text-3xl font-bold text-gray-800">
                        {stats.percentage}%
                      </span>

                      <span className="text-xs text-gray-500">
                        Attendance
                      </span>

                    </div>

                  </div>

                </div>

                <div className="mt-6 space-y-4">

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Present Days
                    </span>

                    <span className="font-semibold">
                      {stats.present}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Absent Days
                    </span>

                    <span className="font-semibold">
                      {stats.absent}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Total Classes
                    </span>

                    <span className="font-semibold">
                      {stats.total}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}
        {/* ================= SELECTED DAY ================= */}

        <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Selected Day
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Attendance details for the selected date
              </p>

            </div>

            <CalendarDays
              className="text-indigo-600"
              size={24}
            />

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Left */}

            <div>

              <p className="text-sm text-gray-500">
                Date
              </p>

              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                {selectedDate.toDateString()}
              </h3>

              <div className="mt-8">

                <p className="text-sm text-gray-500">
                  Attendance Status
                </p>

                <div className="mt-3">

                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${selectedStatus === "present"
                      ? "bg-green-100 text-green-700"
                      : selectedStatus === "absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {selectedStatus === "present" && (
                      <CircleCheck size={18} />
                    )}

                    {selectedStatus === "absent" && (
                      <CircleX size={18} />
                    )}

                    {selectedStatus === "not_marked"
                      ? "Not Marked"
                      : selectedStatus.charAt(0).toUpperCase() +
                      selectedStatus.slice(1)}
                  </span>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="bg-gray-50 rounded-xl p-6">

              <h3 className="font-semibold text-gray-800 mb-5">
                Quick Summary
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Present
                  </span>

                  <span className="font-semibold text-green-600">
                    {stats?.present}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Absent
                  </span>

                  <span className="font-semibold text-red-600">
                    {stats?.absent}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Attendance %
                  </span>

                  <span className="font-semibold text-indigo-600">
                    {stats?.percentage}%
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Performance
                  </span>

                  <span
                    className={`font-semibold ${stats?.percentage >= 75
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {stats?.percentage >= 75
                      ? "Excellent"
                      : "Needs Improvement"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* ================= ATTENDANCE HISTORY ================= */}

        <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ">

          <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Attendance History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Complete attendance record
              </p>
            </div>

            <div className="relative w-full md:w-80">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search date, day or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />

            </div>

          </div>



          {filteredAttendance.length === 0 ? (

            <div className="py-16 text-center">

              <CalendarDays
                size={55}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-5 text-xl font-semibold text-gray-800">
                No Attendance Records
              </h3>

              <p className="mt-2 text-gray-500">
                Attendance will appear here once marked.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                      Day
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAttendance.map((item, index) => (

                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {new Date(item.date).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${item.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item.status === "present" ? (
                            <CircleCheck size={16} />
                          ) : (
                            <CircleX size={16} />
                          )}

                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>
              {!search && attendance.length > 5 && (
                <div className="flex justify-center py-5 border-t">

                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    {showAll ? "View Less" : "View More"}
                  </button>

                </div>
              )}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};
export default StudentAttendance;
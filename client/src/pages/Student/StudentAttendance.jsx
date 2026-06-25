import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // ✅ FIX 1

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, []);

  // MAP attendance
  const attendanceMap = {};
  attendance.forEach((item) => {
    attendanceMap[item.date] = item.status;
  });

  // Calendar colors
  const getTileClass = ({ date }) => {
    const d = date.toISOString().split("T")[0];

    if (attendanceMap[d] === "present") {
      return "bg-green-500 text-green-700 rounded-lg";
    }

    if (attendanceMap[d] === "absent") {
      return "bg-red-100 text-red-700 rounded-lg";
    }

    return "bg-gray-50 text-gray-400 rounded-lg";
  };

  // Selected date logic
  const selectedDateKey = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;

  const selectedInfo = attendance.find(
    (a) => a.date === selectedDateKey
  );

  const selectedStatus = selectedInfo?.status || "not_marked";

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">
          📅 Attendance Overview
        </h1>
        <p className="text-white/80 text-sm">
          Track your daily attendance
        </p>
      </div>

      {/* TOP STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-green-100 p-4 rounded-xl ">
            <p className="text-green-600 text-sm">Present</p>
            <h2 className="text-2xl font-bold">{stats.present}</h2>
          </div>

          <div className="bg-red-100 p-4 rounded-xl ">
            <p className="text-red-600 text-sm">Absent</p>
            <h2 className="text-2xl font-bold">{stats.absent}</h2>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl ">
            <p className="text-blue-600 text-sm">Total</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

          <div className="bg-indigo-200 p-4 rounded-xl ">
            <p className="text-indigo-600 text-sm">%</p>
            <h2 className="text-2xl font-bold">{stats.percentage}%</h2>
          </div>

        </div>
      )}

      {/* MAIN */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* CALENDAR */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl  shadow-sm">

          <h2 className="font-semibold mb-4">
            Monthly Attendance
          </h2>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Calendar
                value={selectedDate}   // ✅ FIX 2 (important)
                onClickDay={(value) => setSelectedDate(value)}
                tileClassName={getTileClass}
                className="w-full -none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-4">

          <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-2xl">
            <h3 className="font-semibold">Today</h3>
            <p className="text-sm text-white/80">
              {new Date().toDateString()}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl ">
            <h3 className="font-semibold mb-3">📊 Insight</h3>

            {stats && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Attendance Rate</span>
                  <span className="font-bold">{stats.percentage}%</span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`font-bold ${
                    stats.percentage >= 75
                      ? "text-green-600"
                      : "text-red-500"
                  }`}>
                    {stats.percentage >= 75 ? "Good" : "Need Improvement"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl ">
            <h3 className="font-semibold mb-3">Legend</h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Present</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Absent</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Not Marked</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SELECTED DAY (NOW ALWAYS SHOWS) */}
      {selectedDate && (
        <div className="bg-white p-5 rounded-2xl ">

          <h2 className="font-bold mb-2">
            📌 Selected Day
          </h2>

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">
                {selectedDate.toDateString()}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Status
              </p>

              <p className="font-semibold">
                {selectedStatus === "not_marked"
                  ? "Not Marked"
                  : selectedStatus}
              </p>
            </div>

            <div className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
              selectedStatus === "present"
                ? "bg-green-500"
                : selectedStatus === "absent"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}>
              {selectedStatus === "not_marked"
                ? "NOT MARKED"
                : selectedStatus.toUpperCase()}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentAttendance;
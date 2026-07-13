import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const attendanceMap = {};

  attendance.forEach((item) => {
    attendanceMap[item.date] = item.status;
  });

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Attendance
        </h1>

        <p className="text-gray-400 mt-1 text-sm">
          Track your attendance and monitor your progress.
        </p>
      </div>

      {/* KPI CARDS */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">
              ✅
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Present
              </p>

              <h2 className="text-xl font-bold text-gray-800">
                {stats.present}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-lg">
              ❌
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Absent
              </p>

              <h2 className="text-xl font-bold text-gray-800">
                {stats.absent}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
              📅
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Total Classes
              </p>

              <h2 className="text-xl font-bold text-gray-800">
                {stats.total}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-lg">
              📊
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Attendance
              </p>

              <h2 className="text-xl font-bold text-gray-800">
                {stats.percentage}%
              </h2>
            </div>
          </div>

        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* CALENDAR */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 pb-4">

          <h2 className="text-lg font-semibold mb-4">
            📅 Monthly Attendance
          </h2>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <Calendar
              value={selectedDate}
              onClickDay={(value) => setSelectedDate(value)}
              tileClassName={getTileClass}
              className=" w-full! border-none! mb-0!"
            />
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-3">

          {/* TODAY */}
          <div className="bg-white rounded-2xl shadow-sm p-2 pl-6">
            <h2 className="font-semibold text-base text-gray-800">
              Today
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              {new Date().toDateString()}
            </p>
          </div>

          {/* ATTENDANCE INSIGHT */}
          <div className="bg-white rounded-2xl shadow-sm p-2 pl-6 pr-6">

            <h2 className="font-semibold text-base text-gray-800 mb-3">
              📊 Attendance Insight
            </h2>

            {stats && (
              <div className="space-y-2">

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    Attendance Rate
                  </span>

                  <span className="font-bold text-base">
                    {stats.percentage}%
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stats.percentage >= 75
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${stats.percentage}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">

                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      stats.percentage >= 75
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stats.percentage >= 75
                      ? "Good"
                      : "Need Improvement"}
                  </span>

                </div>

              </div>
            )}

          </div>

          {/* LEGEND */}
          <div className="bg-white rounded-2xl shadow-sm pl-6 pr-6 p-2">

            <h2 className="font-semibold text-base text-gray-800 mb-3">
              Legend
            </h2>

            <div className="space-y-2">

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-gray-600">
                  Present
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-gray-600">
                  Absent
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-gray-300"></div>
                <span className="text-gray-600">
                  Not Marked
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SELECTED DAY */}
      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-4">
          📌 Selected Day
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div>

            <p className="text-sm text-gray-400">
              Date
            </p>

            <p className="text-base font-semibold text-gray-800">
              {selectedDate.toDateString()}
            </p>

            <p className="text-sm text-gray-400 mt-4">
              Attendance Status
            </p>

            <p className="text-base font-semibold capitalize text-gray-800">
              {selectedStatus === "not_marked"
                ? "Not Marked"
                : selectedStatus}
            </p>

          </div>

          <div
            className={`px-5 py-2 rounded-full text-sm font-semibold text-white ${
              selectedStatus === "present"
                ? "bg-green-500"
                : selectedStatus === "absent"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          >
            {selectedStatus === "not_marked"
              ? "NOT MARKED"
              : selectedStatus.toUpperCase()}
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentAttendance;
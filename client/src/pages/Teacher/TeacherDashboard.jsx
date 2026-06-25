import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/teacher/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-4xl font-bold text-gray-800">
          Teacher Dashboard 👨‍🏫
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-indigo-100 rounded-3xl p-6">
          <p className="text-gray-600">My Classes</p>
          <h2 className="text-4xl font-bold mt-3">
            {data?.classes || 0}
          </h2>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6">
          <p className="text-gray-600">Students</p>
          <h2 className="text-4xl font-bold mt-3">
            {data?.students || 0}
          </h2>
        </div>

        <div className="bg-indigo-100 rounded-3xl p-6">
          <p className="text-gray-600">Attendance</p>
          <h2 className="text-4xl font-bold mt-3">
            {data?.attendance || 0}%
          </h2>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6">
          <p className="text-gray-600">Subjects</p>
          <h2 className="text-4xl font-bold mt-3">
            {data?.subjects || 0}
          </h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <a href="/teacher/attendance"
            className="bg-indigo-50 p-4 rounded-xl hover:bg-indigo-100"
          >
            📝 Mark Attendance
          </a>

          <a href="/teacher/students"
            className="bg-indigo-50 p-4 rounded-xl hover:bg-indigo-100"
          >
            🎓 Students
          </a>

          <a href="/teacher/timetable"
            className="bg-indigo-50 p-4 rounded-xl hover:bg-indigo-100"
          >
            📅 Timetable
          </a>

          <a href="/teacher/announcements"
            className="bg-indigo-50 p-4 rounded-xl hover:bg-indigo-100"
          >
            📢 Announcements
          </a>

        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
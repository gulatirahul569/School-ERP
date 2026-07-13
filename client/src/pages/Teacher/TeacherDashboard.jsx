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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Teacher Dashboard 👨‍🏫
        </h1>

        <p className="text-gray-400 mt-1 text-sm">
          Welcome back
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">🏫</div>
          <div>
            <p className="text-gray-400 text-sm">My Classes</p>
            <h2 className="text-2xl font-bold text-gray-800">{data?.classes || 0}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">🎓</div>
          <div>
            <p className="text-gray-400 text-sm">Students</p>
            <h2 className="text-2xl font-bold text-gray-800">{data?.students || 0}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">📝</div>
          <div>
            <p className="text-gray-400 text-sm">Attendance</p>
            <h2 className="text-2xl font-bold text-gray-800">{data?.attendance || 0}%</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">📚</div>
          <div>
            <p className="text-gray-400 text-sm">Subjects</p>
            <h2 className="text-2xl font-bold text-gray-800">{data?.subjects || 0}</h2>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <a href="/teacher/attendance"
            className="flex items-center gap-3 bg-[#F5F6FE] p-3.5 rounded-xl hover:bg-indigo-100 transition text-gray-700 text-sm font-medium"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">📝</span>
            Mark Attendance
          </a>

          <a href="/teacher/students"
            className="flex items-center gap-3 bg-[#F5F6FE] p-3.5 rounded-xl hover:bg-indigo-100 transition text-gray-700 text-sm font-medium"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">🎓</span>
            Students
          </a>

          <a href="/teacher/timetable"
            className="flex items-center gap-3 bg-[#F5F6FE] p-3.5 rounded-xl hover:bg-indigo-100 transition text-gray-700 text-sm font-medium"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">📅</span>
            Timetable
          </a>

          <a href="/teacher/announcements"
            className="flex items-center gap-3 bg-[#F5F6FE] p-3.5 rounded-xl hover:bg-indigo-100 transition text-gray-700 text-sm font-medium"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">📢</span>
            Announcements
          </a>

        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
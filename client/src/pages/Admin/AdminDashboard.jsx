import React, { useEffect, useState } from "react";
import API from "../../services/API";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading dashboard...</div>
    );
  }

  // -------------------------
  // DATA FOR BAR CHART
  // -------------------------
  const barData = [
    { name: "Students", value: stats?.students || 0 },
    { name: "Teachers", value: stats?.teachers || 0 },
    { name: "Parents", value: stats?.parents || 0 },
    { name: "Classes", value: stats?.classes || 0 },
  ];

  // -------------------------
  // ATTENDANCE PIE CHART
  // -------------------------
  const pieData = [
    { name: "Present", value: stats?.presentToday || 70 },
    { name: "Absent", value: stats?.absentToday || 30 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🧑‍💼 School ERP Dashboard
          </h1>
          <p className="text-gray-500">
            Real-time analytics of your school system
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {barData.map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border"
            >
              <p className="text-gray-500">{item.name}</p>
              <h2 className="text-2xl font-bold">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* GRAPHS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* BAR CHART */}
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="font-semibold mb-4">
              Users Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="font-semibold mb-4">
              Today Attendance
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-4">
            ⚡ Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/classes"
              className="p-3 bg-gray-100 rounded-lg text-center"
            >
              Classes
            </a>

            <a
              href="/admin/attendance"
              className="p-3 bg-gray-100 rounded-lg text-center"
            >
              Attendance
            </a>

            <a
              href="/admin/timetable"
              className="p-3 bg-gray-100 rounded-lg text-center"
            >
              Timetable
            </a>

            <a
              href="/admin/announcement"
              className="p-3 bg-gray-100 rounded-lg text-center"
            >
              Announcements
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
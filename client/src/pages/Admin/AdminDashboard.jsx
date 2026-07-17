import React, { useEffect, useState } from "react";
import API from "../../services/API";

import {
  Users,
  GraduationCap,
  School,
  Megaphone,
  CalendarDays,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");

        console.log("Dashboard Response:", res.data);

        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await API.get("/announcement");

        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        setAnnouncements(list.slice(0, 5));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-500 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Students",
      value: stats?.students || 0,
      icon: Users,
      color: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: "Teachers",
      value: stats?.teachers || 0,
      icon: GraduationCap,
      color: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Parents",
      value: stats?.parents || 0,
      icon: Users,
      color: "bg-amber-100",
      text: "text-amber-600",
    },
    {
      title: "Classes",
      value: stats?.classes || 0,
      icon: School,
      color: "bg-blue-100",
      text: "text-blue-600",
    },
  ];

  const overviewData = [
    {
      name: "Students",
      value: stats?.students || 0,
    },
    {
      name: "Teachers",
      value: stats?.teachers || 0,
    },
    {
      name: "Parents",
      value: stats?.parents || 0,
    },
    {
      name: "Classes",
      value: stats?.classes || 0,
    },
  ];



  const COLORS = ["#4F46E5", "#F59E0B"];

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";
// ================= ATTENDANCE =================

const totalAttendance =
  (stats?.presentToday || 0) + (stats?.absentToday || 0);

const presentPercentage =
  totalAttendance > 0
    ? Math.round(((stats?.presentToday || 0) / totalAttendance) * 100)
    : 0;

const absentPercentage =
  totalAttendance > 0
    ? Math.round(((stats?.absentToday || 0) / totalAttendance) * 100)
    : 0;

const attendanceData = [
  {
    name: "Present",
    value: stats?.presentToday || 0,
  },
  {
    name: "Absent",
    value: stats?.absentToday || 0,
  },
];
  return (
    <div className="space-y-6 p-3 sm:p-2 sm:pt-0 animate-fadeIn">



      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            {greeting}, Admin 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back! Here's what's happening in your school today.
          </p>

          <p className="mt-1 text-sm text-gray-400 flex items-center gap-2">
            <CalendarDays size={16} />

            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

        </div>

        {/* Right Card */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
            A
          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              Administrator
            </h3>

            <p className="text-sm text-gray-500">
              School Management System
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>

              Online
            </div>

          </div>

        </div>

      </div>

      {/* ================= KPI CARDS ================= */}

      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (

            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {card.value}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-green-600">

                    <ArrowUpRight size={16} />

                    <span>
                      {card.title === "Students" && "Registered Students"}
                      {card.title === "Teachers" && "Active Teachers"}
                      {card.title === "Parents" && "Registered Parents"}
                      {card.title === "Classes" && "Running Classes"}
                    </span>

                  </div>

                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}
                >

                  <Icon
                    size={28}
                    className={card.text}
                  />

                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ================= SCHOOL OVERVIEW ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                School Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Overall growth and records of your school.
              </p>

            </div>

            <div className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold">
              Overview
            </div>

          </div>

          {/* Small Stats */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div className="rounded-xl bg-indigo-50 p-4">

              <p className="text-xs text-gray-500">
                Students
              </p>

              <h3 className="text-2xl font-bold text-indigo-700 mt-1">
                {stats?.students || 0}
              </h3>

            </div>

            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-xs text-gray-500">
                Teachers
              </p>

              <h3 className="text-2xl font-bold text-green-700 mt-1">
                {stats?.teachers || 0}
              </h3>

            </div>

            <div className="rounded-xl bg-amber-50 p-4">

              <p className="text-xs text-gray-500">
                Parents
              </p>

              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {stats?.parents || 0}
              </h3>

            </div>

            <div className="rounded-xl bg-blue-50 p-4">

              <p className="text-xs text-gray-500">
                Classes
              </p>

              <h3 className="text-2xl font-bold text-blue-700 mt-1">
                {stats?.classes || 0}
              </h3>

            </div>

          </div>

          {/* Chart */}

          <ResponsiveContainer
            width="100%"
            height={330}
          >

            <BarChart
              data={overviewData}
              barSize={48}
            >

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: 14,
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                }}
              />

              <Bar
                dataKey="value"
                fill="#4F46E5"
                radius={[12, 12, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* ================= ATTENDANCE ================= */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-xl font-bold text-gray-900">
        Attendance Analytics
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Today's attendance overview
      </p>
    </div>

    <div className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-semibold">
      Live
    </div>

  </div>

  <div className="grid lg:grid-cols-2 gap-8 items-center">

    {/* Pie Chart */}

    <div className="h-72">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={attendanceData}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
          >

            {attendanceData.map((item, index) => (

              <Cell
                key={index}
                fill={COLORS[index]}
              />

            ))}

          </Pie>

          <Tooltip
            formatter={(value, name) => [
              `${value} Students (${name === "Present"
                ? presentPercentage
                : absentPercentage}%)`,
              name,
            ]}
            contentStyle={{
              borderRadius: 14,
              border: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>

    {/* Statistics */}

    <div className="space-y-4">

      {/* Present */}

      <div className="rounded-2xl bg-indigo-50 p-3">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-sm text-gray-500">
              Present Students
            </p>

            <h3 className="text-3xl font-bold text-indigo-700 mt-2">
              {presentPercentage}%
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {stats?.presentToday || 0} Students
            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
            ✅
          </div>

        </div>

      </div>

      {/* Absent */}

      <div className="rounded-2xl bg-amber-50 p-3">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-sm text-gray-500">
              Absent Students
            </p>

            <h3 className="text-3xl font-bold text-amber-600 mt-2">
              {absentPercentage}%
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {stats?.absentToday || 0} Students
            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            📋
          </div>

        </div>

      </div>

      {/* Progress */}

      <div className="rounded-xl border border-gray-200 p-3">

        <div className="flex justify-between mb-3">

          <span className="text-sm text-gray-500">
            Overall Attendance
          </span>

          <span className="font-semibold text-indigo-700">
            {presentPercentage}%
          </span>

        </div>

        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">

          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${presentPercentage}%`,
            }}
          />

        </div>

      </div>

      {/* Insight */}

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

        <p className="text-sm text-gray-500">
          Attendance Status
        </p>

        <h4 className="font-semibold text-gray-800 mt-2">

          {presentPercentage >= 90
            ? "Excellent Attendance 🎉"
            : presentPercentage >= 75
            ? "Good Attendance 👍"
            : presentPercentage >= 50
            ? "Average Attendance 🙂"
            : "Attendance Needs Improvement"}

        </h4>

      </div>

    </div>

  </div>

</div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ================= QUICK ACTIONS ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Quick Actions
          </h2>

          <div className="space-y-3">

            <a
              href="/admin/student"
              className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 p-4 transition"
            >

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Users
                    size={20}
                    className="text-indigo-600"
                  />
                </div>

                <span className="font-medium text-gray-700">
                  Manage Students
                </span>

              </div>

              →
            </a>

            <a
              href="/admin/teacher"
              className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 p-4 transition"
            >

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <GraduationCap
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <span className="font-medium text-gray-700">
                  Manage Teachers
                </span>

              </div>

              →
            </a>

            <a
              href="/admin/class"
              className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 p-4 transition"
            >

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <School
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <span className="font-medium text-gray-700">
                  Manage Classes
                </span>

              </div>

              →
            </a>

            <a
              href="/admin/announcement"
              className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 p-4 transition"
            >

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Megaphone
                    size={20}
                    className="text-amber-600"
                  />
                </div>

                <span className="font-medium text-gray-700">
                  Announcements
                </span>

              </div>

              →
            </a>

          </div>

        </div>

        {/* ================= LATEST ANNOUNCEMENTS ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 pt-0">

          <div className="flex items-center justify-between p-6 border-b border-gray-100">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Latest Announcements
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Recently published notices
              </p>

            </div>

            <a
              href="/admin/announcement"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </a>

          </div>
          <div className="space-y-4">

            {announcements.slice(0, 2).map((item) => (

              <div
                key={item._id}
                className="group rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-300 overflow-hidden"
              >


                <div className="p-2 pl-5 pr-5">

                  {/* Header */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                        <Megaphone
                          size={22}
                          className="text-indigo-600"
                        />

                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      Notice
                    </span>

                  </div>

                  {/* Message */}

                  <p className="mt-4 text-gray-600 leading-7 line-clamp-3">
                    {item.message}
                  </p>

                  {/* Footer */}

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                    <span className="text-sm text-gray-500">

                      {item.type === "global"
                        ? "🌍 Global Announcement"
                        : item.classId?.name
                          ? `🏫 Class ${item.classId.name}`
                          : "🏫 Class Announcement"}

                    </span>

                    <span className="text-xs text-gray-400">
                      By {item.createdBy?.name || "Administrator"}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
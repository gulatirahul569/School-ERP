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
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");
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
        <p className="text-gray-500 text-lg">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "Students",
      value: stats?.students || 0,
      color: "bg-indigo-100",
      icon: "🎓",
    },
    {
      title: "Teachers",
      value: stats?.teachers || 0,
      color: "bg-yellow-100",
      icon: "👨‍🏫",
    },
    {
      title: "Parents",
      value: stats?.parents || 0,
      color: "bg-indigo-100",
      icon: "👨‍👩‍👧",
    },
    {
      title: "Classes",
      value: stats?.classes || 0,
      color: "bg-yellow-100",
      icon: "🏫",
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

  const attendanceData = [
    {
      name: "Present",
      value: Number(stats?.presentToday) || 70,
    },
    {
      name: "Absent",
      value: Number(stats?.absentToday) || 30,
    },
  ];

  const COLORS = ["#6366F1", "#FBBF24"];

  return (
    <div className="space-y-6 bg-[#F4F6FB] p-6 rounded-3xl">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Welcome back, Admin 👋
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2.5 shadow-sm w-full md:w-auto">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search for students/teachers/documents..."
            className="bg-transparent outline-none text-sm text-gray-500 w-full md:w-72"
            disabled
          />
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`}
            >
              {card.icon}
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                {card.title}
              </p>

              <h2 className="text-2xl font-bold text-gray-800">
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN SECTION */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-6">
          {/* OVERVIEW */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg text-gray-800">
                School Overview
              </h2>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                Overview
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={overviewData} barSize={36}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#6366F1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ATTENDANCE */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-gray-800 mb-5">
              Today's Attendance
            </h2>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map(
                        (entry, index) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index % COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full"></div>

                  <span className="font-medium text-gray-700">
                    Present :{" "}
                    <span className="text-gray-900 font-semibold">
                      {attendanceData[0].value}%
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full"></div>

                  <span className="font-medium text-gray-700">
                    Absent :{" "}
                    <span className="text-gray-900 font-semibold">
                      {attendanceData[1].value}%
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">
          {/* DATE */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-gray-800">
              Today's Date
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              {new Date().toDateString()}
            </p>
          </div>

          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-gray-800 mb-4">
              Quick Actions
            </h2>

            <div className="grid gap-2.5">
              <a
                href="/admin/student"
                className="flex items-center gap-3 bg-[#F5F6FE] hover:bg-indigo-100 p-3.5 rounded-xl transition text-gray-700 text-sm font-medium"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  🎓
                </span>
                Manage Students
              </a>

              <a
                href="/admin/teacher"
                className="flex items-center gap-3 bg-[#F5F6FE] hover:bg-indigo-100 p-3.5 rounded-xl transition text-gray-700 text-sm font-medium"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  👨‍🏫
                </span>
                Manage Teachers
              </a>

              <a
                href="/admin/attendance"
                className="flex items-center gap-3 bg-[#F5F6FE] hover:bg-indigo-100 p-3.5 rounded-xl transition text-gray-700 text-sm font-medium"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  📝
                </span>
                Attendance
              </a>

              <a
                href="/admin/timetable"
                className="flex items-center gap-3 bg-[#F5F6FE] hover:bg-indigo-100 p-3.5 rounded-xl transition text-gray-700 text-sm font-medium"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  📅
                </span>
                Timetable
              </a>
            </div>
          </div>

          {/* ANNOUNCEMENTS */}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-800">
                Announcements
              </h2>

              <a
                href="/admin/announcement"
                className="text-indigo-500 text-sm font-medium"
              >
                View All
              </a>
            </div>

            {announcements.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No announcements available
              </p>
            ) : (
              <div className="space-y-3">
                {announcements.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                  >
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {item.message}
                    </p>

                    <p className="text-xs text-gray-300 mt-2">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
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

export default AdminDashboard;

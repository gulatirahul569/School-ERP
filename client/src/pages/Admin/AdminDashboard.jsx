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

  const COLORS = ["#818CF8", "#FCD34D"];

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            School Management Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back, Admin 👋
          </p>
        </div>

        
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-3xl p-6`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-3 text-gray-800">
                  {card.value}
                </h2>
              </div>

              <div className="text-3xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN SECTION */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-6">
          {/* OVERVIEW */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-xl mb-5">
              School Overview
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart data={overviewData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#818CF8"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ATTENDANCE */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-xl mb-5">
              Today's Attendance
            </h2>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="h-70">
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

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>

                  <span className="font-medium">
                    Present :{" "}
                    {attendanceData[0].value}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>

                  <span className="font-medium">
                    Absent :{" "}
                    {attendanceData[1].value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">
          {/* DATE */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-xl">
              Today's Date
            </h2>

            <p className="text-gray-500 mt-2">
              {new Date().toDateString()}
            </p>
          </div>

          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-xl mb-4">
              Quick Actions
            </h2>

            <div className="grid gap-3">
              <a
                href="/admin/student"
                className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition"
              >
                🎓 Manage Students
              </a>

              <a
                href="/admin/teacher"
                className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition"
              >
                👨‍🏫 Manage Teachers
              </a>

              <a
                href="/admin/attendance"
                className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition"
              >
                📝 Attendance
              </a>

              <a
                href="/admin/timetable"
                className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl transition"
              >
                📅 Timetable
              </a>
            </div>
          </div>

          {/* ANNOUNCEMENTS */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">
                Announcements
              </h2>

              <a
                href="/admin/announcement"
                className="text-indigo-600 text-sm"
              >
                View All
              </a>
            </div>

            {announcements.length === 0 ? (
              <p className="text-gray-500">
                No announcements available
              </p>
            ) : (
              <div className="space-y-3">
                {announcements.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
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
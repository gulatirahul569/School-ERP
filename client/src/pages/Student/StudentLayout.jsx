import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItem = (to, label) => (
    <Link
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center p-3 rounded-xl transition font-medium ${
        isActive(to)
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b flex items-center justify-between p-4 sticky top-0 z-50">
        <h2 className="font-bold text-lg text-gray-800">
          Student Portal
        </h2>

        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl text-gray-700"
        >
          ☰
        </button>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-80
          bg-white border-r border-gray-200
          p-5 z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* MOBILE CLOSE */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="font-bold text-lg text-gray-800">
            Student Portal
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {/* LOGO */}
        <div className="hidden md:flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">
            🎓
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Student Portal
            </h2>

            <p className="text-sm text-gray-500">
              School ERP
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Menu
          </p>

          {navItem("/student", "🏠 Dashboard")}
          {navItem("/student/attendance", "📝 Attendance")}
          {navItem("/student/timetable", "📅 Timetable")}
          {navItem("/student/fees", "💰 My Fees")}
          {navItem("/student/announcements", "📢 Announcements")}
          {navItem("/student/result", "🎓 Result")}
          {navItem("/student/profile", "👤 My Profile")}
        </nav>

        {/* USER CARD */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="bg-gray-50 border rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">
              Logged in as
            </p>

            <p className="font-semibold text-gray-800 truncate">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500 truncate">
              {user?.email}
            </p>

            <button
              onClick={logout}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="md:ml-80 p-6 min-h-screen bg-[#F6F7FC]">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
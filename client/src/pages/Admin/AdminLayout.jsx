import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItem = (to, label) => (
    <Link
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm font-medium ${
        isActive(to)
          ? "bg-white text-indigo-600 shadow-sm"
          : "text-indigo-100/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#1E2340] flex items-center justify-between p-4 sticky top-0 z-50">
        <h2 className="font-bold text-lg text-white">
          🦉 SchoolHub
        </h2>

        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl text-white"
        >
          ☰
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-[#1E2340]
          p-4 z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* MOBILE CLOSE */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="font-bold text-lg text-white">
            SchoolHub
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-xl text-white"
          >
            ✕
          </button>
        </div>

        {/* LOGO */}
        <div className="hidden md:flex items-center gap-4 mb-2 px-1">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl">
            🦉
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              SchoolHub
            </h2>

            <p className="text-xs text-indigo-200/70">
              Admin Portel
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y">
          <p className="text-xs font-semibold text-indigo-200/50 uppercase mb-2 px-3.5 tracking-wide">
            Menu
          </p>

          {navItem("/admin", "📊 Dashboard")}
          {navItem("/admin/classes", "🏫 Class Management")}
          {navItem("/admin/attendance", "📝 Attendance")}
          {navItem("/admin/fees", "💰 Fees")}
          {navItem("/admin/announcement", "📢 Announcements")}
          {navItem("/admin/timetable", "📅 Timetable")}

          <div className="border-t border-white/10 my-4"></div>

          <p className="text-xs font-semibold text-indigo-200/50 uppercase mb-2 px-3.5 tracking-wide">
            Users
          </p>

          {navItem("/admin/student", "🎓 Students")}
          {navItem("/admin/teacher", "👨‍🏫 Teachers")}
        </nav>

        {/* USER CARD */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="w-52 bg-white/5 border border-white/10 rounded-xl pl-3 pr-3 pb-2 pt-2">
            <p className="text-[10px] text-indigo-200/50">
              Logged in as
            </p>

            <p className="mt-1 text-sm font-semibold text-white truncate">
              {user?.name}
            </p>

            <p className="text-[11px] text-indigo-200/60 truncate">
              {user?.email}
            </p>

            <button
              onClick={logout}
              className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition text-xs font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="md:ml-64 p-3 sm:p-5 lg:p-5 min-h-screen bg-[#F4F6FB]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
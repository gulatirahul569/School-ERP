import { Routes, Route } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import Login from "./pages/Login";
import Register from "./pages/Register";

// =========================
// ADMIN PAGES
// =========================
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Classes from "./pages/Admin/Classes";
import Attendance from "./pages/Admin/Attendance";
import Announcement from "./pages/Admin/Announcement";
import Timetable from "./pages/Admin/Timetable";
import AdminTeachers from "./pages/Admin/AdminTeachers";
import AdminStudents from "./pages/Admin/AdminStudents";

// =========================
// STUDENT PAGES
// =========================
import StudentLayout from "./pages/Student/StudentLayout";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentAttendance from "./pages/Student/StudentAttendance";
import StudentTimetable from "./pages/Student/StudentTimetable";
import StudentAnnouncements from "./pages/Student/StudentAnnouncements";
import StudentProfile from "./pages/Student/StudentProfile";

// teacher pages

import TeacherLayout from "./pages/Teacher/TeacherLayout";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";

// =========================
// AUTH GUARD
// =========================
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ========================= */}
      {/* AUTH ROUTES */}
      {/* ========================= */}

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========================= */}
      {/* ADMIN ROUTES */}
      {/* ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="classes" element={<Classes />} />

        <Route path="attendance" element={<Attendance />} />

        <Route path="announcement" element={<Announcement />} />

        <Route path="timetable" element={<Timetable />} />

        <Route path="teacher" element={<AdminTeachers />} />

        <Route path="student" element={<AdminStudents />} />
      </Route>

      {/* ========================= */}
      {/* STUDENT ROUTES */}
      {/* ========================= */}

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<StudentDashboard />} />

        {/* Modules */}
        <Route path="attendance" element={<StudentAttendance />} />

        <Route path="timetable" element={<StudentTimetable />} />

        <Route path="announcements" element={<StudentAnnouncements />} />

        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;

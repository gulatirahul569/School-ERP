import { Routes, Route } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import Login from "./pages/Login";


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
import Result2 from "./pages/Student/Result2";

// teacher pages

import TeacherLayout from "./pages/Teacher/TeacherLayout";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";

// =========================
// AUTH GUARD
// =========================
import ProtectedRoute from "./routes/ProtectedRoute";
import MyClasses from "./pages/Teacher/Myclasses";
import ClassDetails from "./pages/Teacher/ClassDetails";
import TeacherAttendance from "./pages/Teacher/TeacherAttendance";
import TeacherTimetable from "./pages/Teacher/TeacherTimetable";
import TeacherAnnouncement from "./pages/Teacher/TeacherAnnouncements";
import Result from "./pages/Teacher/Result";
import AdminFees from "./pages/Admin/AdminFees";
import StudentFees from "./pages/Student/StudentFees";
import TeacherFees from "./pages/Teacher/TeacherFees";


function App() {
  return (
    <Routes>
      {/* ========================= */}
      {/* AUTH ROUTES */}
      {/* ========================= */}

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />


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
        <Route path="fees" element={<AdminFees />} /> 
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
        <Route path="fees" element={<StudentFees />} /> 

        <Route path="profile" element={<StudentProfile />} />
        <Route path="result" element={<Result2 />} />
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
        <Route path="classes" element={<MyClasses />} />
        <Route path="classes/:id" element={<ClassDetails />}/>
        <Route path="attendance" element={<TeacherAttendance />}/>
        <Route path="timetable" element={<TeacherTimetable />}/>
        <Route path="Announcements" element={<TeacherAnnouncement />}/>
        <Route path="fees" element={<TeacherFees />} />
        <Route path="result" element={<Result />}/>

      </Route>
    </Routes>
  );
}

export default App;
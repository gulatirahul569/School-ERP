import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import Classes from "./pages/admin/Classes";
import Attendance from "./pages/admin/Attendance";
import Announcement from "./pages/Admin/Announcement";
import Timetable from "./pages/Admin/Timetable";


// auth guard
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminTeachers from "./pages/Admin/AdminTeachers";
import AdminStudents from "./pages/Admin/AdminStudents";


function App() {
  return (
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========================= */}
        {/* ADMIN ROUTES (PROTECTED) */}
        {/* ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* default dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* modules */}
          <Route path="classes" element={<Classes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="teacher" element={<AdminTeachers />} />
          <Route path="student" element={<AdminStudents />} />

        </Route>

      </Routes>

  );
}

export default App;
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import Classes from "./pages/admin/Classes";
// import Announcements from "./pages/admin/Announcements";

// auth guard
import ProtectedRoute from "./routes/ProtectedRoute";

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
          {/* <Route path="announcements" element={<Announcements />} /> */}

        </Route>

      </Routes>

  );
}

export default App;
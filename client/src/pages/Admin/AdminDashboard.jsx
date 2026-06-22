import React, { useEffect, useState } from "react";
import API from "../../services/API";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        🧑‍💼 Admin Control Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold">Students</h2>
          <p>{stats?.students || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold">Teachers</h2>
          <p>{stats?.teachers || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold">Parents</h2>
          <p>{stats?.parents || 0}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/teacher/classes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">👨‍🏫 Teacher Dashboard</h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Assigned Classes</h2>

        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>No classes assigned</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
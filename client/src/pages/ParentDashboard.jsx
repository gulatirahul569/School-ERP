import React, { useEffect, useState } from "react";
import axios from "axios";

const ParentDashboard = () => {
  const [childData, setChildData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/parent/child`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChildData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchChildData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">👨‍👩‍👧 Parent Dashboard</h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Child Details</h2>

        {childData ? (
          <pre>{JSON.stringify(childData, null, 2)}</pre>
        ) : (
          <p>No child linked yet</p>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
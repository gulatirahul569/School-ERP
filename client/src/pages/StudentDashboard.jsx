import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [timetable, setTimetable] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // get student data from token (optional simple decode)
  useEffect(() => {
    const role = localStorage.getItem("role");

    setUser({
      role,
    });
  }, []);

  // fetch timetable
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/student/timetable`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTimetable(res.data.timetable);
      } catch (err) {
        console.log("Error fetching timetable", err);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <div className="bg-white shadow p-4 rounded-xl mb-6">
        <h1 className="text-2xl font-bold">
          Student Dashboard 🎓
        </h1>
        <p className="text-gray-600">
          Welcome {user?.role}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* TIMETABLE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            📅 Timetable
          </h2>

          {timetable.length > 0 ? (
            timetable.map((day, index) => (
              <div key={index} className="mb-3 border-b pb-2">
                <h3 className="font-bold">{day.day}</h3>
                <p className="text-gray-600">
                  {day.subjects.join(", ")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No timetable found</p>
          )}
        </div>

        {/* QUICK INFO */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            📊 Quick Info
          </h2>

          <div className="space-y-3">
            <div className="p-3 bg-blue-100 rounded">
              Attendance: 90%
            </div>

            <div className="p-3 bg-green-100 rounded">
              Results: A Grade
            </div>

            <div className="p-3 bg-yellow-100 rounded">
              Announcements: 2 New
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
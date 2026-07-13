import React, { useEffect, useState } from "react";
import axios from "axios";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// FIXED SLOT STRUCTURE (MATCH ADMIN EXACTLY)
const TIME_SLOTS = [
  { periodNo: 1, label: "Period 1", time: "09:00 - 10:00" },
  { periodNo: 2, label: "Period 2", time: "10:00 - 11:00" },
  { periodNo: 3, label: "Period 3", time: "11:00 - 12:00" },

  { periodNo: 0, label: "BREAK", time: "12:00 - 12:30", break: true },

  { periodNo: 4, label: "Period 4", time: "12:30 - 13:30" },
  { periodNo: 5, label: "Period 5", time: "13:30 - 14:30" },
  { periodNo: 6, label: "Period 6", time: "14:30 - 15:30" },
];

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/timetable/my`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setTimetable(res.data || []);
      } catch (err) {
        console.log(err);
        setTimetable([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // ✅ MAP using periodNo (FIXED)
  const timetableMap = {};

  timetable.forEach((dayData) => {
    const map = {};

    dayData.periods.forEach((p) => {
      map[p.periodNo] = p;
    });

    timetableMap[dayData.day] = map;
  });

  if (loading) {
    return <div className="p-6 text-gray-500">Loading timetable...</div>;
  }

  return (
    <div className="p-4 space-y">
      {/* HEADER */}
      <div className=" text-black pl-6 pr-6 text-center">
        <h1 className="text-2xl font-bold">📅 Weekly Timetable</h1>
        <p className="text-white/80 text-sm">
          Fixed period schedule (with break)
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-3 border">Time</th>

              {DAYS.map((day) => (
                <th key={day} className="p-3 border">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {TIME_SLOTS.map((slot, index) => (
              <tr key={index} className="text-center border">
                {/* TIME COLUMN */}
                <td className="p-3 font-semibold border bg-gray-100">
                  <div>{slot.label}</div>
                  <div className="text-xs text-gray-500">{slot.time}</div>
                </td>

                {/* BREAK ROW */}
                {slot.break ? (
                  <td
                    colSpan={6}
                    className="p-4 bg-yellow-100 text-yellow-700 font-bold"
                  >
                    🍱 BREAK TIME (30 MIN)
                  </td>
                ) : (
                  DAYS.map((day) => {
                    const period = timetableMap?.[day]?.[slot.periodNo];

                    return (
                      <td key={day} className="p-3 border">
                        {period ? (
                          <div>
                            <p className="font-semibold text-gray-800">
                              {period.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {period.teacher?.name || "Teacher"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTimetable;

import { useEffect, useState } from "react";
import axios from "../../services/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIME_SLOTS = [
  { periodNo: 1, label: "Period 1", time: "09:00 - 10:00" },
  { periodNo: 2, label: "Period 2", time: "10:00 - 11:00" },
  { periodNo: 3, label: "Period 3", time: "11:00 - 12:00" },
  { periodNo: 4, label: "Period 4", time: "12:30 - 13:30" },
  { periodNo: 5, label: "Period 5", time: "13:30 - 14:30" },
  { periodNo: 6, label: "Period 6", time: "14:30 - 15:30" },
];

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/timetable/teacher");

        setTimetable(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Create timetable map
  // NOTE: The API returns ONE document per (class, day) pair, filtered to
  // this teacher's periods within that class. A teacher can appear in
  // multiple documents for the SAME day (e.g. Period 1 for Class 9-A and
  // Period 2 for Class 10-B, both on Monday). So we must MERGE periods
  // into the existing day map instead of replacing it, or earlier classes
  // for that day get wiped out.
  const timetableMap = {};

  timetable.forEach((dayData) => {
    if (!timetableMap[dayData.day]) {
      timetableMap[dayData.day] = {};
    }

    dayData.periods.forEach((period) => {
      timetableMap[dayData.day][period.periodNo] = {
        ...period,
        classId: dayData.classId,
      };
    });
  });

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading timetable...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">📅 My Timetable</h1>
        <p className="text-white/80 mt-1">
          View your assigned teaching schedule
        </p>
      </div>

      {/* Timetable */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Period</th>

              {DAYS.map((day) => (
                <th key={day} className="p-3 border">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.periodNo} className="text-center">
                {/* Time Column */}
                <td className="border p-3 bg-gray-50">
                  <div className="font-semibold">
                    {slot.label}
                  </div>

                  <div className="text-xs text-gray-500">
                    {slot.time}
                  </div>
                </td>

                {/* Day Columns */}
                {DAYS.map((day) => {
                  const period =
                    timetableMap?.[day]?.[slot.periodNo];

                  return (
                    <td
                      key={day}
                      className="border p-3 h-24 align-middle"
                    >
                      {period ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-800">
                            {period.subject}
                          </p>

                          <p className="text-sm text-indigo-600 font-medium">
                            Class {period.classId?.name}
                            {period.classId?.section &&
                              ` - ${period.classId.section}`}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-lg">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && timetable.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No timetable assigned.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTimetable;
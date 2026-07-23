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

  // Merge timetable by day and period
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
    <div className="p-3 sm:p-4 md:p-6 space-y-5">
            {/* Header */}
      <div className="bg-linear-to-r from-black to-gray-500 text-white p-4 sm:p-6 rounded-2xl shadow">
        <h1 className="text-xl sm:text-2xl font-bold">
          📅 My Timetable
        </h1>

        <p className="text-white/80 mt-1 text-sm sm:text-base">
          View your assigned teaching schedule
        </p>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="w-full min-w-225 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-3 text-left font-semibold">
                Period
              </th>

              {DAYS.map((day) => (
                <th
                  key={day}
                  className="border px-4 py-3 text-center font-semibold whitespace-nowrap"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.periodNo} className="text-center">
                {/* Period Column */}
                <td className="border px-4 py-4 bg-gray-50">
                  <div className="font-semibold">
                    {slot.label}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {slot.time}
                  </div>
                </td>

                {/* Days */}
                {DAYS.map((day) => {
                  const period =
                    timetableMap?.[day]?.[slot.periodNo];

                  return (
                    <td
                      key={day}
                      className="border px-3 py-5 h-24 align-middle"
                    >
                      {period ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-800 text-sm lg:text-base">
                            {period.subject}
                          </p>

                          <p className="text-xs lg:text-sm text-indigo-600 font-medium">
                            Class {period.classId?.name}
                            {period.classId?.section &&
                              ` - ${period.classId.section}`}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xl">
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
{/* Mobile View */}
<div className="md:hidden space-y-5">
  {DAYS.map((day) => (
    <div
      key={day}
      className="bg-white rounded-2xl shadow border overflow-hidden"
    >
      {/* Day Header */}
      <div className="bg-linear-to-r from-black to-gray-500 text-white px-4 py-3">
        <h2 className="text-lg font-bold">{day}</h2>
      </div>

      {/* Period List */}
      <div className="divide-y divide-gray-200">
        {TIME_SLOTS.map((slot) => {
          const period = timetableMap?.[day]?.[slot.periodNo];

          return (
            <div
              key={slot.periodNo}
              className="flex justify-between items-start p-4"
            >
              {/* Left */}
              <div>
                <p className="font-semibold text-gray-800">
                  {slot.label}
                </p>

                <p className="text-xs text-gray-500">
                  {slot.time}
                </p>
              </div>

              {/* Right */}
              {period ? (
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {period.subject}
                  </p>

                  <p className="text-sm text-gray-600">
                    Class {period.classId?.name}
                    {period.classId?.section &&
                      ` - ${period.classId.section}`}
                  </p>
                </div>
              ) : (
                <span className="text-gray-400 font-medium">
                  Free
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ))}

  {!loading && timetable.length === 0 && (
    <div className="bg-white rounded-xl border shadow text-center py-8 text-gray-500">
      No timetable assigned.
    </div>
  )}
</div>
    </div>
  );
};

export default TeacherTimetable;
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
  { periodNo: 4, label: "Period 4", time: "12:00 - 13:00" },
  { periodNo: 5, label: "Period 5", time: "13:00 - 14:00" },
  { periodNo: 6, label: "Period 6", time: "14:00 - 15:00" },
];

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  const teacherId = JSON.parse(localStorage.getItem("user"))?._id;

  // ======================
  // FETCH ALL TIMETABLE (WORKING API)
  // ======================
  useEffect(() => {
    const fetch = async () => {
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

    fetch();
  }, []);

  // ======================
  // FETCH CLASSES (for dropdown UI)
  // ======================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/class/my-classes");
        setClasses(res.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClasses();
  }, []);

  // ======================
  // MAP LOGIC (UNCHANGED)
  // ======================
  const map = {};

  timetable.forEach((day) => {
    const m = {};
    day.periods.forEach((p) => {
      m[p.periodNo] = p;
    });
    map[day.day] = m;
  });

  if (loading) {
    return <div className="p-6 text-gray-500">Loading timetable...</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">📅 My Timetable</h1>
        <p className="text-white/80 text-sm">
          View your assigned teaching schedule
        </p>
      </div>

      {/* CLASS FILTER (UI ONLY) */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        <label className="text-sm font-semibold text-gray-600">
          Filter by Class
        </label>

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="w-full mt-2 border p-3 rounded-xl"
        >
          <option value="">All Classes</option>

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} - {cls.section}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border">

        <table className="w-full border-collapse">

          {/* HEADER */}
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Period</th>

              {DAYS.map((d) => (
                <th key={d} className="p-3 border">
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.periodNo} className="text-center border">

                {/* PERIOD */}
                <td className="p-3 font-semibold border bg-gray-50">
                  <div>{slot.label}</div>
                  <div className="text-xs text-gray-500">
                    {slot.time}
                  </div>
                </td>

                {/* DAYS */}
                {DAYS.map((day) => {
                  const period = map?.[day]?.[slot.periodNo];

                  // CLASS FILTER LOGIC (OPTIONAL UI FILTER)
                  if (classId && period?.classId?._id !== classId) {
                    return (
                      <td key={day} className="p-3 border text-gray-300">
                        -
                      </td>
                    );
                  }

                  return (
                    <td key={day} className="p-3 border">
                      {period ? (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {period.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {period.classId?.name} - {period.classId?.section}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TeacherTimetable;
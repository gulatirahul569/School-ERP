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

// FIXED PERIOD STRUCTURE (6 periods + break)
const PERIOD_SLOTS = [
  { label: "Period 1", start: "09:00", end: "10:00" },
  { label: "Period 2", start: "10:00", end: "11:00" },
  { label: "Period 3", start: "11:00", end: "12:00" },
  { label: "BREAK", start: "12:00", end: "12:30", isBreak: true },
  { label: "Period 4", start: "12:30", end: "13:30" },
  { label: "Period 5", start: "13:30", end: "14:30" },
  { label: "Period 6", start: "14:30", end: "15:30" },
];

// SAME STRUCTURE AS STUDENT VIEW
const TIME_SLOTS = [
  { periodNo: 1, label: "Period 1", time: "09:00 - 10:00" },
  { periodNo: 2, label: "Period 2", time: "10:00 - 11:00" },
  { periodNo: 3, label: "Period 3", time: "11:00 - 12:00" },
  { periodNo: 0, label: "BREAK", time: "12:00 - 12:30", break: true },
  { periodNo: 4, label: "Period 4", time: "12:30 - 13:30" },
  { periodNo: 5, label: "Period 5", time: "13:30 - 14:30" },
  { periodNo: 6, label: "Period 6", time: "14:30 - 15:30" },
];

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [classId, setClassId] = useState("");
  const [day, setDay] = useState("");

  const [periods, setPeriods] = useState(
    PERIOD_SLOTS.map((p, i) => ({
      periodNo: i + 1,
      subject: "",
      teacher: "",
      startTime: p.start,
      endTime: p.end,
      isBreak: p.isBreak || false,
    })),
  );

  const [timetable, setTimetable] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, teacherRes] = await Promise.all([
          axios.get("/class"),
          axios.get("/user?role=teacher"),
        ]);

        setClasses(classRes.data?.classes || classRes.data?.data || []);
        setTeachers(teacherRes.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // LOAD CLASS
  const handleClassChange = async (e) => {
    const value = e.target.value;
    setClassId(value);

    if (!value) {
      setTimetable([]);
      return;
    }

    try {
      const res = await axios.get(`/timetable/class/${value}`);
      setTimetable(Array.isArray(res.data) ? res.data : []);

      setPeriods(
        PERIOD_SLOTS.map((p, i) => ({
          periodNo: i + 1,
          subject: "",
          teacher: "",
          startTime: p.start,
          endTime: p.end,
          isBreak: p.isBreak || false,
        })),
      );
    } catch (err) {
      console.log(err);
      setTimetable([]);
    }
  };

  // LOAD DAY DATA
  useEffect(() => {
    if (!classId || !day) return;

    const loadDayData = async () => {
      try {
        const res = await axios.get(`/timetable/class/${classId}`);
        const all = Array.isArray(res.data) ? res.data : [];

        const dayData = all.find((t) => t.day === day);

        if (dayData) {
          setPeriods(
            PERIOD_SLOTS.map((slot, i) => {
              const existing = dayData.periods.find(
                (p) => p.startTime === slot.start,
              );

              return {
                periodNo: i + 1,
                subject: existing?.subject || "",
                teacher: existing?.teacher || "",
                startTime: slot.start,
                endTime: slot.end,
                isBreak: slot.isBreak || false,
              };
            }),
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDayData();
  }, [classId, day]);

  const updatePeriod = (index, field, value) => {
    const updated = [...periods];
    updated[index][field] = value;
    setPeriods(updated);
  };

  // SAVE
  const handleSubmit = async () => {
    if (!classId || !day) {
      return setMessage("Select class and day");
    }

    try {
      setSaving(true);

      await axios.post("/timetable", {
        classId,
        day,
        periods: periods
          .filter((p) => !p.isBreak)
          .map((p, i) => ({
            periodNo: i + 1,
            subject: p.subject,
            teacher: p.teacher,
            startTime: p.startTime,
            endTime: p.endTime,
          })),
      });

      setMessage("Timetable saved successfully");

      const res = await axios.get(`/timetable/class/${classId}`);
      setTimetable(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving timetable");
    } finally {
      setSaving(false);
    }
  };

  // BUILD MAP (IMPORTANT)
  const timetableMap = {};

  timetable.forEach((dayData) => {
    const map = {};

    dayData.periods.forEach((p) => {
      map[p.periodNo] = p;
    });

    timetableMap[dayData.day] = map;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📅 Timetable Management</h1>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}

        {/* CLASS + DAY */}
        <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-2 gap-4">
          <select
            value={classId}
            onChange={handleClassChange}
            className="border p-2 rounded"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>

          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Day</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* EDIT PERIODS (UNCHANGED) */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-3">Fixed Period Structure</h2>

          {periods.map((p, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-2 mb-3 items-center">
              <div className="font-semibold text-gray-600">
                {PERIOD_SLOTS[i].label}
              </div>

              {p.isBreak ? (
                <div className="col-span-3 text-center text-red-500 font-bold">
                  BREAK TIME ☕
                </div>
              ) : (
                <>
                  <input
                    placeholder="Subject"
                    value={p.subject}
                    onChange={(e) =>
                      updatePeriod(i, "subject", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <select
                    value={p.teacher}
                    onChange={(e) =>
                      updatePeriod(i, "teacher", e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <div className="text-sm text-gray-500">
                    {p.startTime} - {p.endTime}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Timetable"}
        </button>

        {/* ✅ NEW: SAME TABLE AS STUDENT VIEW */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">📘 Saved Timetable</h2>

          {timetable.length === 0 ? (
            <p>No timetable found</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Time</th>
                    {DAYS.map((d) => (
                      <th key={d} className="p-3 border">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {TIME_SLOTS.map((slot, idx) => (
                    <tr key={idx} className="text-center border">
                      <td className="p-3 border bg-gray-50">
                        <div className="font-semibold">{slot.label}</div>
                        <div className="text-xs text-gray-500">
                          {slot.time}
                        </div>
                      </td>

                      {slot.break ? (
                        <td
                          colSpan={6}
                          className="p-4 bg-yellow-100 font-bold text-yellow-800"
                        >
                          🍱 BREAK TIME
                        </td>
                      ) : (
                        DAYS.map((day) => {
                          const period =
                            timetableMap?.[day]?.[slot.periodNo];

                          return (
                            <td key={day} className="p-3 border">
                              {period ? (
                                <div>
                                  <p className="font-semibold">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
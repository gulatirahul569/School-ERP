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

  // =========================
  // FETCH CLASSES + TEACHERS
  // =========================
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

  // =========================
  // LOAD TIMETABLE ON CLASS CHANGE
  // =========================
  const handleClassChange = async (e) => {
    const value = e.target.value;
    setClassId(value);

    if (!value) {
      setTimetable([]);
      return;
    }

    try {
      const res = await axios.get(`/timetable/class/${value}`);

      const data = Array.isArray(res.data) ? res.data : [];

      setTimetable(data);

      // reset periods when class changes
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

  // =========================
  // LOAD DAY DATA (IMPORTANT FIX)
  // =========================
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

  // =========================
  // UPDATE PERIOD
  // =========================
  const updatePeriod = (index, field, value) => {
    const updated = [...periods];
    updated[index][field] = value;
    setPeriods(updated);
  };

  // =========================
  // SAVE TIMETABLE
  // =========================
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
            periodNo: i + 1, // 🔥 FIXED: ALWAYS 1-6
            subject: p.subject,
            teacher: p.teacher,
            startTime: p.startTime,
            endTime: p.endTime,
          })),
      });

      setMessage("Timetable saved successfully");

      // reload after save
      const res = await axios.get(`/timetable/class/${classId}`);
      setTimetable(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving timetable");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UI
  // =========================
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

        {/* PERIODS */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-3">Fixed Period Structure</h2>

          {periods.map((p, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-2 mb-3 items-center"
            >
              {/* LABEL */}
              <div className="font-semibold text-gray-600">
                {PERIOD_SLOTS[i].label}
              </div>

              {/* BREAK */}
              {p.isBreak ? (
                <div className="col-span-3 text-center text-red-500 font-bold">
                  BREAK TIME ☕
                </div>
              ) : (
                <>
                  {/* SUBJECT */}
                  <input
                    placeholder="Subject"
                    value={p.subject}
                    onChange={(e) => updatePeriod(i, "subject", e.target.value)}
                    className="border p-2 rounded"
                  />

                  {/* TEACHER */}
                  <select
                    value={p.teacher}
                    onChange={(e) => updatePeriod(i, "teacher", e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  {/* TIME */}
                  <div className="text-sm text-gray-500">
                    {p.startTime} - {p.endTime}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* SAVE */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Timetable"}
        </button>

        {/* DISPLAY */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Saved Timetable</h2>

          {timetable.length === 0 ? (
            <p>No timetable found</p>
          ) : (
            timetable.map((t) => (
              <div key={t._id} className="bg-white p-4 rounded shadow mb-3">
                <h3 className="font-bold">{t.day}</h3>

                {t.periods.map((p, i) => (
                  <div key={i} className="text-sm text-gray-700">
                    {p.subject} | {p.startTime} - {p.endTime}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;

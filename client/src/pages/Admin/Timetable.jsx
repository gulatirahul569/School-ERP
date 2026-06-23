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

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [classId, setClassId] = useState("");
  const [day, setDay] = useState("");

  const [periods, setPeriods] = useState([
    {
      subject: "",
      teacher: "",
      startTime: "",
      endTime: "",
    },
  ]);

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
  // FETCH TIMETABLE
  // =========================
  const fetchTimetable = async (id) => {
    if (!id) return;

    try {
      const res = await axios.get(`/timetable/class/${id}`);
      setTimetable(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setTimetable([]);
    }
  };

  // =========================
  // CLASS CHANGE
  // =========================
  const handleClassChange = (e) => {
    const value = e.target.value;
    setClassId(value);

    if (value) fetchTimetable(value);
    else setTimetable([]);
  };

  // =========================
  // PERIOD HANDLING
  // =========================
  const addPeriod = () => {
    setPeriods([
      ...periods,
      {
        subject: "",
        teacher: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const updatePeriod = (index, field, value) => {
    const updated = [...periods];
    updated[index][field] = value;
    setPeriods(updated);
  };

  // =========================
  // SUBMIT TIMETABLE
  // =========================
  const handleSubmit = async () => {
    if (!classId) return setMessage("Select class first");
    if (!day) return setMessage("Select day first");

    // 🔥 FIX: prevent empty teacher crash
    const cleanedPeriods = periods.map((p) => ({
      ...p,
      teacher: p.teacher || null,
    }));

    try {
      setSaving(true);
      setMessage("");

      await axios.post("/timetable", {
        classId,
        day,
        periods: cleanedPeriods,
      });

      setMessage("Timetable saved successfully");
      fetchTimetable(classId);
    } catch (err) {
      console.log(err);
      setMessage(
        err.response?.data?.message || "Error saving timetable"
      );
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

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          📅 Timetable Management
        </h1>

        {/* MESSAGE */}
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
          <h2 className="font-bold mb-3">Periods</h2>

          {periods.map((p, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-2 mb-3"
            >

              {/* SUBJECT */}
              <input
                placeholder="Subject"
                value={p.subject}
                onChange={(e) =>
                  updatePeriod(i, "subject", e.target.value)
                }
                className="border p-2 rounded"
              />

              {/* TEACHER DROPDOWN (FIXED) */}
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

              {/* TIME */}
              <input
                type="time"
                value={p.startTime}
                onChange={(e) =>
                  updatePeriod(i, "startTime", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                type="time"
                value={p.endTime}
                onChange={(e) =>
                  updatePeriod(i, "endTime", e.target.value)
                }
                className="border p-2 rounded"
              />

            </div>
          ))}

          <button
            onClick={addPeriod}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Period
          </button>
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
          <h2 className="text-xl font-bold mb-3">
            Saved Timetable
          </h2>

          {timetable.length === 0 ? (
            <p>No timetable found</p>
          ) : (
            timetable.map((t) => (
              <div
                key={t._id}
                className="bg-white p-4 rounded shadow mb-3"
              >
                <h3 className="font-bold">{t.day}</h3>

                {t.periods.map((p, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-700"
                  >
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
import React, { useEffect, useState } from "react";
import API from "../../services/API";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    section: "",
  });

  // 👇 FIXED: per-class selected student
  const [selectedStudents, setSelectedStudents] = useState({});

  // =========================
  // FETCH CLASSES
  // =========================
  const fetchClasses = async () => {
    try {
      const res = await API.get("/class");
      setClasses(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = async () => {
    try {
      const res = await API.get("/user?role=student");
      setStudents(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  // =========================
  // CREATE CLASS
  // =========================
  const createClass = async (e) => {
    e.preventDefault();

    try {
      await API.post("/class", form);
      setForm({ name: "", section: "" });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating class");
    }
  };

  // =========================
  // DELETE CLASS
  // =========================
  const deleteClass = async (id) => {
    try {
      await API.delete(`/class/${id}`);
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting class");
    }
  };

  // =========================
  // ASSIGN STUDENT
  // =========================
  const assignStudent = async (classId) => {
    const studentId = selectedStudents[classId];

    if (!studentId) return;

    try {
      await API.post("/class/assign-student", {
        classId,
        studentId,
      });

      setSelectedStudents({
        ...selectedStudents,
        [classId]: "",
      });

      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning student");
    }
  };

  // =========================
  // REMOVE STUDENT
  // =========================
  const removeStudent = async (classId, studentId) => {
    try {
      await API.post("/class/remove-student", {
        classId,
        studentId,
      });

      fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        🏫 Class Management
      </h1>

      {/* CREATE CLASS */}
      <form
        onSubmit={createClass}
        className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3"
      >
        <input
          type="text"
          placeholder="Class Name (e.g. 10)"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Section (A/B/C)"
          value={form.section}
          onChange={(e) =>
            setForm({ ...form, section: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <button className="bg-black text-white px-4 rounded">
          Create
        </button>
      </form>

      {/* CLASS LIST */}
      <div className="grid md:grid-cols-2 gap-4">

        {classes.map((cls) => (
          <div
            key={cls._id}
            className="bg-white p-4 rounded-xl shadow"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">
                Class {cls.name}-{cls.section}
              </h2>

              <button
                onClick={() => deleteClass(cls._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>

            {/* ASSIGN STUDENT */}
            <div className="flex gap-2 mt-3">
              <select
                value={selectedStudents[cls._id] || ""}
                onChange={(e) =>
                  setSelectedStudents({
                    ...selectedStudents,
                    [cls._id]: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              >
                <option value="">Select student</option>
                {(students || []).map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => assignStudent(cls._id)}
                className="bg-green-600 text-white px-3 rounded"
              >
                Add
              </button>
            </div>

            {/* STUDENT LIST */}
            <div className="mt-4 space-y-2">

              {(!cls.students || cls.students.length === 0) && (
                <p className="text-gray-500 text-sm">
                  No students assigned
                </p>
              )}

              {cls.students?.map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>{s.name}</span>

                  <button
                    onClick={() =>
                      removeStudent(cls._id, s._id)
                    }
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
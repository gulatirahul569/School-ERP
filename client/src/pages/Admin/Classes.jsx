import React, { useEffect, useState } from "react";
import API from "../../services/API";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    section: "",
  });

  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedTeachers, setSelectedTeachers] = useState({});

  useEffect(() => {
    fetchClasses();
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/class");
      setClasses(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/user?role=student");
      setStudents(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/user?role=teacher");
      setTeachers(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const createClass = async (e) => {
    e.preventDefault();

    try {
      await API.post("/class", form);
      setForm({
        name: "",
        section: "",
      });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await API.delete(`/class/${id}`);
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const assignTeacher = async (classId) => {
    const teacherId = selectedTeachers[classId];

    if (!teacherId) return;

    try {
      await API.post("/class/assign-teacher", {
        classId,
        teacherId,
      });

      setSelectedTeachers({
        ...selectedTeachers,
        [classId]: "",
      });

      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const removeTeacher = async (classId) => {
    try {
      await API.post("/class/remove-teacher", {
        classId,
      });

      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

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
      alert(err.response?.data?.message);
    }
  };

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
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Class Management
            </h1>

            <p className="text-gray-500">
              Manage classes, teachers and students
            </p>
          </div>

        </div>

        {/* Create */}

        <form
          onSubmit={createClass}
          className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Class Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border rounded-xl p-3 flex-1"
          />

          <input
            type="text"
            placeholder="Section"
            value={form.section}
            onChange={(e) =>
              setForm({ ...form, section: e.target.value })
            }
            className="border rounded-xl p-3 flex-1"
          />

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
            Create
          </button>
        </form>

        {/* Cards */}

        <div className="grid lg:grid-cols-2 gap-6">

          {classes.map((cls) => (

            <div
              key={cls._id}
              className="bg-white rounded-2xl shadow p-6"
            >

              {/* Header */}

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">
                    Class {cls.name}-{cls.section}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {cls.students.length} Students
                  </p>

                </div>

                <button
                  onClick={() => deleteClass(cls._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>

              </div>

              {/* Teacher */}

              <div className="mt-6 border rounded-xl p-4 bg-indigo-50">

                <h3 className="font-semibold mb-3">
                  Class Teacher
                </h3>

                {cls.classTeacher ? (

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-semibold">
                        {cls.classTeacher.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {cls.classTeacher.email}
                      </p>

                    </div>

                    <button
                      onClick={() => removeTeacher(cls._id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>

                  </div>

                ) : (

                  <div className="flex gap-2">

                    <select
                      className="border rounded-lg p-2 flex-1"
                      value={selectedTeachers[cls._id] || ""}
                      onChange={(e) =>
                        setSelectedTeachers({
                          ...selectedTeachers,
                          [cls._id]: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Select Teacher
                      </option>

                      {teachers.map((teacher) => (
                        <option
                          key={teacher._id}
                          value={teacher._id}
                        >
                          {teacher.name}
                        </option>
                      ))}

                    </select>

                    <button
                      onClick={() => assignTeacher(cls._id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-lg"
                    >
                      Assign
                    </button>

                  </div>

                )}

              </div>

              {/* Student */}

              <div className="mt-6">

                <h3 className="font-semibold mb-3">
                  Students
                </h3>

                <div className="flex gap-2 mb-4">

                  <select
                    className="border rounded-lg p-2 flex-1"
                    value={selectedStudents[cls._id] || ""}
                    onChange={(e) =>
                      setSelectedStudents({
                        ...selectedStudents,
                        [cls._id]: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select Student
                    </option>

                    {students.map((student) => (
                      <option
                        key={student._id}
                        value={student._id}
                      >
                        {student.name}
                      </option>
                    ))}

                  </select>

                  <button
                    onClick={() => assignStudent(cls._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg"
                  >
                    Add
                  </button>

                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">

                  {cls.students.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No students assigned
                    </div>
                  )}

                  {cls.students.map((student) => (

                    <div
                      key={student._id}
                      className="flex justify-between items-center border rounded-xl p-3"
                    >

                      <div>

                        <p className="font-medium">
                          {student.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {student.email}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          removeStudent(cls._id, student._id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
};

export default Classes;
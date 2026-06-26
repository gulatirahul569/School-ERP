import { useEffect, useState } from "react";
import axios from "../../services/api";

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [savedAttendance, setSavedAttendance] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ======================
  // GET TEACHER CLASSES
  // ======================
  useEffect(() => {
    fetchMyClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents();
    } else {
      setStudents([]);
      setAttendance([]);
      setSavedAttendance(null);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && date && students.length > 0) {
      fetchAttendance();
    }
  }, [selectedClass, date, students]);

  const fetchMyClasses = async () => {
    try {
      const res = await axios.get("/class/my-classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchClassStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/class/${selectedClass}`);

      const studentList = res.data?.data?.students || res.data?.students || [];

      setStudents(studentList);

      setAttendance(
        studentList.map((student) => ({
          student: student._id,
          status: "present",
        })),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `/attendance/by-date?classId=${selectedClass}&date=${date}`,
      );

      const records = res.data?.attendance?.records || [];

      setSavedAttendance(res.data?.attendance || null);

      setAttendance(
        students.map((student) => {
          const found = records.find((r) => {
            const id =
              typeof r.student === "object" ? r.student._id : r.student;

            return id === student._id;
          });

          return {
            student: student._id,
            status: found?.status || "present",
          };
        }),
      );
    } catch (err) {
      setSavedAttendance(null);

      setAttendance(
        students.map((s) => ({
          student: s._id,
          status: "present",
        })),
      );
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((r) => {
        const id = typeof r.student === "object" ? r.student._id : r.student;

        return id === studentId ? { ...r, status } : r;
      }),
    );
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setMessage("");

      await axios.post("/attendance/mark", {
        classId: selectedClass,
        date,
        records: attendance,
      });

      setMessage("Attendance saved successfully");
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER (same as admin) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Management
          </h1>
          <p className="text-gray-500 mt-1">
            View & mark attendance for your assigned classes
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700 shadow-sm">
            {message}
          </div>
        )}

        {/* FILTER CARD (same as admin) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CLASS */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Class
              </label>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.name} {cls.section ? `- ${cls.section}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Attendance Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* SUMMARY CARD (same as admin) */}
        {selectedClass && savedAttendance && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Attendance Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-green-50 p-4 border border-green-100">
                <p className="text-green-700 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-800">
                  {
                    savedAttendance.records.filter(
                      (r) => r.status === "present",
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <p className="text-red-700 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-800">
                  {
                    savedAttendance.records.filter((r) => r.status === "absent")
                      .length
                  }
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                <p className="text-blue-700 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-800">
                  {savedAttendance.records.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABLE CARD (EXACT ADMIN STYLE) */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                Student Attendance
              </h3>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading students...
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No students found
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-3">#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.map((student, index) => {
                          const current = attendance.find(
                            (a) => a.student === student._id,
                          );

                          return (
                            <tr
                              key={student._id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3">{index + 1}</td>
                              <td>{student.name}</td>
                              <td>{student.email}</td>
                              <td>
                                <select
                                  value={current.status || "present"}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      student._id,
                                      e.target.value,
                                    )
                                  }
                                  className={`px-3 py-1 rounded-lg border text-sm font-medium
                                  ${
                                    current.status === "absent"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                  }`}
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                    >
                      {saving ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;

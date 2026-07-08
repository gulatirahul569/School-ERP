import { useEffect, useState } from "react";
import axios from "../../services/api";

const EXAM_TYPES = [
  "Unit Test 1",
  "Unit Test 2",
  "Mid Term",
  "Final Term",
];

const Result = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState(EXAM_TYPES[0]);
  const [maxMarks, setMaxMarks] = useState(100);

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [savedResult, setSavedResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

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
      setMarks([]);
      setSavedResult(null);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && subject && examType && students.length > 0) {
      fetchExistingResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, subject, examType, students]);

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

      setMarks(
        studentList.map((student) => ({
          student: student._id,
          marksObtained: 0,
          remarks: "",
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingResult = async () => {
    try {
      const res = await axios.get("/result/by-sheet", {
        params: { classId: selectedClass, subject, examType },
      });

      const records = res.data?.records || [];
      const result = res.data?.result || null;

      setSavedResult(result);

      if (result?.maxMarks) {
        setMaxMarks(result.maxMarks);
      }

      setMarks(
        students.map((student) => {
          const found = records.find((r) => {
            const id = typeof r.student === "object" ? r.student._id : r.student;
            return id === student._id;
          });

          return {
            student: student._id,
            marksObtained: found?.marksObtained ?? 0,
            remarks: found?.remarks || "",
          };
        })
      );
    } catch (err) {
      setSavedResult(null);
      setMarks(
        students.map((s) => ({
          student: s._id,
          marksObtained: 0,
          remarks: "",
        }))
      );
    }
  };

  const handleMarksChange = (studentId, value) => {
    const numeric = Number(value);
    const clamped = Number.isNaN(numeric)
      ? 0
      : Math.max(0, Math.min(numeric, Number(maxMarks) || 100));

    setMarks((prev) =>
      prev.map((m) => (m.student === studentId ? { ...m, marksObtained: clamped } : m))
    );
  };

  const handleRemarksChange = (studentId, value) => {
    setMarks((prev) =>
      prev.map((m) => (m.student === studentId ? { ...m, remarks: value } : m))
    );
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setMessageType("error");
      setMessage("Please enter a subject before saving.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await axios.post("/result/mark", {
        classId: selectedClass,
        subject: subject.trim(),
        examType,
        maxMarks: Number(maxMarks) || 100,
        records: marks,
      });

      setMessageType("success");
      setMessage("Result saved successfully");
      fetchExistingResult();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to save result");
    } finally {
      setSaving(false);
    }
  };

  const gradeFor = (obtained, max) => {
    const pct = max > 0 ? (obtained / max) * 100 : 0;
    if (pct >= 90) return { label: "A+", color: "text-green-700 bg-green-50 border-green-200" };
    if (pct >= 75) return { label: "A", color: "text-green-700 bg-green-50 border-green-200" };
    if (pct >= 60) return { label: "B", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (pct >= 40) return { label: "C", color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    return { label: "F", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const classAverage =
    marks.length > 0
      ? Math.round(
          (marks.reduce((sum, m) => sum + m.marksObtained, 0) /
            marks.length /
            (Number(maxMarks) || 1)) *
            100
        )
      : 0;

  const passCount = marks.filter(
    (m) => (m.marksObtained / (Number(maxMarks) || 1)) * 100 >= 40
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Result Management
          </h1>
          <p className="text-gray-500 mt-1">
            Enter and update exam marks for your assigned classes
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 shadow-sm ${
              messageType === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* FILTER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

            {/* SUBJECT */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
              />
            </div>

            {/* EXAM TYPE */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Exam
              </label>

              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
              >
                {EXAM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* MAX MARKS */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Max Marks
              </label>

              <input
                type="number"
                min="1"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* SUMMARY CARD */}
        {selectedClass && subject && marks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Result Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                <p className="text-indigo-700 font-medium">Class Average</p>
                <p className="text-2xl font-bold text-indigo-800">
                  {classAverage}%
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4 border border-green-100">
                <p className="text-green-700 font-medium">Passed</p>
                <p className="text-2xl font-bold text-green-800">
                  {passCount} / {marks.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                <p className="text-blue-700 font-medium">
                  {savedResult ? "Last Saved" : "Status"}
                </p>
                <p className="text-lg font-bold text-blue-800">
                  {savedResult
                    ? new Date(savedResult.updatedAt).toLocaleDateString()
                    : "Not saved yet"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABLE CARD */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                Student Marks {subject ? `- ${subject}` : ""}
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
                          <th>Marks Obtained</th>
                          <th>Grade</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.map((student, index) => {
                          const current = marks.find(
                            (m) => m.student === student._id
                          ) || { marksObtained: 0, remarks: "" };

                          const grade = gradeFor(
                            current.marksObtained,
                            Number(maxMarks) || 100
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
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxMarks}
                                    value={current.marksObtained}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        student._id,
                                        e.target.value
                                      )
                                    }
                                    className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                  />
                                  <span className="text-gray-400 text-xs">
                                    / {maxMarks}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`px-3 py-1 rounded-lg border text-sm font-medium ${grade.color}`}
                                >
                                  {grade.label}
                                </span>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={current.remarks}
                                  onChange={(e) =>
                                    handleRemarksChange(
                                      student._id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional note"
                                  className="w-full min-w-35 rounded-lg border border-gray-300 px-3 py-1.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
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
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Result"}
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

export default Result;
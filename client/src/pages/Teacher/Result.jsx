import { useEffect, useMemo, useState } from "react";
import axios from "../../services/api";

const EXAM_TYPES = ["Unit Test 1", "Unit Test 2", "Mid Term", "Final Term"];

const Result = () => {
  // ==========================
  // STATES
  // ==========================
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [teacherSubjects, setTeacherSubjects] = useState([]);

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

  // NEW
  const [search, setSearch] = useState("");

  // ==========================
  // LOAD CLASSES
  // ==========================
  useEffect(() => {
    fetchMyClasses();
  }, []);

  // ==========================
  // LOAD STUDENTS
  // ==========================
  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents();
    } else {
      setStudents([]);
      setMarks([]);
      setSavedResult(null);
    }
  }, [selectedClass]);

  // ==========================
  // LOAD SAVED RESULT
  // ==========================
  useEffect(() => {
    if (selectedClass && subject && examType && students.length > 0) {
      fetchExistingResult();
    }

    // eslint-disable-next-line
  }, [selectedClass, subject, examType, students]);

  useEffect(() => {
    fetchTeacherDashboard();
    fetchMyClasses();
  }, []);

const fetchTeacherDashboard = async () => {
  try {
    const res = await axios.get("/teacher/dashboard");

    console.log(res.data);

    setTeacherSubjects(res.data.subjectList || []);
  } catch (err) {
    console.log(err);
  }
};

  // ==========================
  // GET MY CLASSES
  // ==========================
  const fetchMyClasses = async () => {
    try {
      const res = await axios.get("/class/my-classes");

      setClasses(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // GET STUDENTS OF CLASS
  // ==========================
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
        })),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD EXISTING RESULT
  // ==========================
  const fetchExistingResult = async () => {
    try {
      const res = await axios.get("/result/by-sheet", {
        params: {
          classId: selectedClass,
          subject,
          examType,
        },
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
            const id =
              typeof r.student === "object" ? r.student._id : r.student;

            return id === student._id;
          });

          return {
            student: student._id,
            marksObtained: found?.marksObtained ?? 0,
            remarks: found?.remarks || "",
          };
        }),
      );
    } catch (err) {
      setSavedResult(null);

      setMarks(
        students.map((student) => ({
          student: student._id,
          marksObtained: 0,
          remarks: "",
        })),
      );
    }
  };

  // ==========================
  // MARKS CHANGE
  // ==========================
  const handleMarksChange = (studentId, value) => {
    const numeric = Number(value);

    const finalValue = Number.isNaN(numeric)
      ? 0
      : Math.max(0, Math.min(numeric, Number(maxMarks) || 100));

    setMarks((prev) =>
      prev.map((m) =>
        m.student === studentId
          ? {
              ...m,
              marksObtained: finalValue,
            }
          : m,
      ),
    );
  };

  // ==========================
  // REMARK CHANGE
  // ==========================
  const handleRemarksChange = (studentId, value) => {
    setMarks((prev) =>
      prev.map((m) =>
        m.student === studentId
          ? {
              ...m,
              remarks: value,
            }
          : m,
      ),
    );
  };

  // ==========================
  // SAVE RESULT
  // ==========================
  const handleSubmit = async () => {
    if (!subject.trim()) {
      setMessageType("error");
      setMessage("Please enter subject name.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await axios.post("/result/mark", {
        classId: selectedClass,
        subject: subject.trim(),
        examType,
        maxMarks: Number(maxMarks),
        records: marks,
      });

      setMessageType("success");
      setMessage("Result saved successfully.");

      fetchExistingResult();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to save result.");
    } finally {
      setSaving(false);
    }
  };
  // ==========================
  // GRADE
  // ==========================
  const gradeFor = (obtained, max) => {
    const percentage = max > 0 ? (obtained / max) * 100 : 0;

    if (percentage >= 90)
      return {
        label: "A+",
        color: "bg-green-100 text-green-700 border-green-200",
      };

    if (percentage >= 75)
      return {
        label: "A",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      };

    if (percentage >= 60)
      return {
        label: "B",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };

    if (percentage >= 40)
      return {
        label: "C",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };

    return {
      label: "F",
      color: "bg-red-100 text-red-700 border-red-200",
    };
  };

  // ==========================
  // FILTERED STUDENTS
  // ==========================
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;

    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  // ==========================
  // SUMMARY
  // ==========================
  const totalStudents = marks.length;

  const totalMarks = marks.reduce((sum, item) => sum + item.marksObtained, 0);

  const classAverage =
    totalStudents > 0
      ? Math.round((totalMarks / totalStudents / (Number(maxMarks) || 1)) * 100)
      : 0;

  const passCount = marks.filter(
    (m) => (m.marksObtained / (Number(maxMarks) || 1)) * 100 >= 40,
  ).length;

  const failCount = totalStudents - passCount;

  const passPercentage =
    totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

  // ==========================
  // TOPPER
  // ==========================
  const topper = students.reduce((best, student) => {
    const current = marks.find((m) => m.student === student._id);

    if (!current) return best;

    if (!best || current.marksObtained > best.marksObtained) {
      return {
        ...student,
        marksObtained: current.marksObtained,
      };
    }

    return best;
  }, null);

  // ==========================
  // DASHBOARD CARDS
  // ==========================
  const dashboardCards = [
    {
      title: "Students",
      value: totalStudents,
      icon: "👨‍🎓",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
    },
    {
      title: "Average",
      value: `${classAverage}%`,
      icon: "📊",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Pass Rate",
      value: `${passPercentage}%`,
      icon: "✅",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Top Score",
      value: topper ? `${topper.marksObtained}/${maxMarks}` : "--",
      icon: "🏆",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
  ];
  return (
    <div className="space-y-6 p-3 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Result Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage examination results for your assigned classes
          </p>
        </div>

        {savedResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-xs text-green-600 font-medium">Last Updated</p>

            <p className="font-semibold text-green-800">
              {new Date(savedResult.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div
          className={`rounded-xl border px-5 py-4 ${
            messageType === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* ================= KPI CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl border border-gray-100 p-5 flex items-center gap-4`}
          >
            <div
              className={`${card.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}
            >
              {card.icon}
            </div>

            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>

              <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FILTER CARD ================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-gray-800 text-lg">
            Examination Details
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {/* CLASS */}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Class
              </label>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Class</option>

                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.name}
                    {cls.section && ` - ${cls.section}`}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Subject</option>

                {teacherSubjects?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* EXAM */}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Exam
              </label>

              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
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
                Maximum Marks
              </label>

              <input
                type="number"
                value={maxMarks}
                min={1}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* SEARCH */}

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Search Student
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESULT SUMMARY ================= */}

      {selectedClass && subject && marks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Class Average</p>

            <h2 className="text-3xl font-bold text-indigo-600 mt-2">
              {classAverage}%
            </h2>

            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${classAverage}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Students Passed</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {passCount}
            </h2>

            <p className="text-sm text-gray-400 mt-2">Failed : {failCount}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Highest Score</p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {topper ? `${topper.marksObtained}/${maxMarks}` : "--"}
            </h2>

            <p className="text-sm text-gray-400 mt-2 truncate">
              {topper?.name || "No Data"}
            </p>
          </div>
        </div>
      )}

      {/* ================= STUDENT TABLE ================= */}

      {selectedClass && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-5 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Student Marks
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredStudents.length} Students
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium">
                {examType}
              </span>

              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                {subject || "Subject"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-14 text-gray-500">
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-14 text-gray-500">
                No students found.
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b">
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-500">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wide text-gray-500">
                      Marks
                    </th>

                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wide text-gray-500">
                      Grade
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-500">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student, index) => {
                    const current = marks.find(
                      (m) => m.student === student._id,
                    ) || {
                      marksObtained: 0,
                      remarks: "",
                    };

                    const grade = gradeFor(
                      current.marksObtained,
                      Number(maxMarks) || 100,
                    );

                    const percentage = Math.round(
                      (current.marksObtained / (Number(maxMarks) || 1)) * 100,
                    );

                    return (
                      <tr
                        key={student._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        {/* SERIAL */}
                        <td className="px-6 py-5 text-gray-500 font-medium">
                          {index + 1}
                        </td>

                        {/* STUDENT */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                              {student.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {student.name}
                              </p>

                              <p className="text-xs text-gray-400">Student</p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-6 py-5 text-gray-500">
                          {student.email}
                        </td>

                        {/* MARKS */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <input
                              type="number"
                              min="0"
                              max={maxMarks}
                              value={current.marksObtained}
                              onChange={(e) =>
                                handleMarksChange(student._id, e.target.value)
                              }
                              className="w-24 rounded-xl border border-gray-300 text-center px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <div className="text-xs text-gray-400 whitespace-nowrap">
                              / {maxMarks}
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  percentage >= 75
                                    ? "bg-green-500"
                                    : percentage >= 40
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* GRADE */}
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-14 px-3 py-1 rounded-full border text-sm font-semibold ${grade.color}`}
                          >
                            {grade.label}
                          </span>
                        </td>

                        {/* REMARKS */}
                        <td className="px-6 py-5">
                          <input
                            type="text"
                            value={current.remarks}
                            onChange={(e) =>
                              handleRemarksChange(student._id, e.target.value)
                            }
                            placeholder="Add remarks..."
                            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* FOOTER */}
          {!loading && filteredStudents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-5 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold">{filteredStudents.length}</span>{" "}
                students
              </div>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Results"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Result;

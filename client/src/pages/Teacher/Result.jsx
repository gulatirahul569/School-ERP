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
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
            Teacher Portal
          </p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Result Management
          </h1>

          <p className="mt-2 text-gray-500 max-w-2xl">
            Enter, update and manage examination results for your assigned
            classes. All changes are saved securely and can be edited anytime.
          </p>
        </div>

        <div className="flex flex-col items-start xl:items-end gap-3">
          {savedResult && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Last Updated
              </p>

              <p className="mt-1 font-semibold text-emerald-700">
                {new Date(savedResult.updatedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-white font-semibold shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving Results..." : "Save Results"}
          </button> */}
        </div>
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 shadow-sm ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">
              {messageType === "error" ? "⚠️" : "✅"}
            </div>

            <p className="font-medium">{message}</p>
          </div>
        </div>
      )}


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

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Examination Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select class, subject and examination before entering marks.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
            Result Sheet
          </span>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {/* CLASS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Class
              </label>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Examination
              </label>

              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Maximum Marks
              </label>

              <input
                type="number"
                min={1}
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* SEARCH */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search Student
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* ================= RESULT SUMMARY ================= */}

{selectedClass && subject && marks.length > 0 && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Average Card */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Class Average
          </p>

          <h2 className="mt-2 text-4xl font-bold text-indigo-600">
            {classAverage}%
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
          📊
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Performance</span>
          <span>{classAverage}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${classAverage}%` }}
          />
        </div>
      </div>
    </div>

    {/* Pass / Fail */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Pass Statistics
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-600">
            {passCount}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
          ✅
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-xs font-medium uppercase text-green-600">
            Passed
          </p>

          <p className="mt-2 text-2xl font-bold text-green-700">
            {passCount}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-xs font-medium uppercase text-red-600">
            Failed
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">
            {failCount}
          </p>
        </div>

      </div>
    </div>

    {/* Top Performer */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Top Performer
          </p>

          <h2 className="mt-2 text-4xl font-bold text-purple-600">
            {topper ? `${topper.marksObtained}/${maxMarks}` : "--"}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
          🏆
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-gray-50 p-4">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          Student Name
        </p>

        <p className="mt-1 text-lg font-semibold text-gray-800 truncate">
          {topper?.name || "No Data Available"}
        </p>

        {topper && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-sm text-gray-500">
              Percentage
            </span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
              {Math.round(
                (topper.marksObtained / (Number(maxMarks) || 1)) * 100
              )}
              %
            </span>
          </div>
        )}

      </div>
    </div>

  </div>
)}

 {/* ================= STUDENT TABLE ================= */}

{selectedClass && (
  <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

    {/* Header */}
    <div className="flex flex-col gap-5 border-b border-gray-100 bg-white px-6 py-6 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Student Results
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter marks and remarks for each student.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
            Exam
          </p>

          <p className="font-semibold text-indigo-700">
            {examType}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Subject
          </p>

          <p className="font-semibold text-gray-700">
            {subject || "--"}
          </p>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-green-500">
            Students
          </p>

          <p className="font-semibold text-green-700">
            {filteredStudents.length}
          </p>
        </div>

      </div>
    </div>

  {/* Mobile View */}
  <div className="md:hidden space-y-4 p-4">
    {filteredStudents.map((student, index) => {
      const current =
        marks.find((m) => m.student === student._id) || {
          marksObtained: 0,
          remarks: "",
        };

      const grade = gradeFor(
        current.marksObtained,
        Number(maxMarks) || 100
      );

      const percentage = Math.round(
        (current.marksObtained / (Number(maxMarks) || 1)) * 100
      );

      return (
        <div
          key={student._id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {student.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-gray-900">
                {student.name}
              </h3>

              <p className="truncate text-sm text-gray-500">
                {student.email}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${grade.color}`}
            >
              {grade.label}
            </span>
          </div>

          {/* Marks */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Marks
            </label>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max={maxMarks}
                value={current.marksObtained}
                onChange={(e) =>
                  handleMarksChange(student._id, e.target.value)
                }
                className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-center"
              />

              <span className="text-sm text-gray-500">
                / {maxMarks}
              </span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${
                  percentage >= 75
                    ? "bg-green-500"
                    : percentage >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Remarks
            </label>

            <input
              type="text"
              value={current.remarks}
              onChange={(e) =>
                handleRemarksChange(student._id, e.target.value)
              }
              placeholder="Add remarks..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2"
            />
          </div>
        </div>
      );
    })}
  </div>

  {/* Desktop Table */}
  <div className="hidden md:block overflow-x-auto">

      {loading ? (
        <div className="flex h-72 items-center justify-center">

          <div className="flex flex-col items-center gap-4">

            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>

            <p className="text-gray-500 font-medium">
              Loading students...
            </p>

          </div>

        </div>
      ) : filteredStudents.length === 0 ? (

        <div className="flex h-72 flex-col items-center justify-center">

          <div className="mb-4 text-6xl">
            🎓
          </div>

          <h3 className="text-xl font-semibold text-gray-700">
            No Students Found
          </h3>

          <p className="mt-2 text-gray-500">
            Try selecting another class or search again.
          </p>

        </div>

      ) : (

        <table className="min-w-full">

          <thead className="sticky top-0 z-20 border-b border-gray-200 bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                #
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Student
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Email
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                Marks
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                Grade
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Remarks
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student, index) => {
  const current =
    marks.find((m) => m.student === student._id) || {
      marksObtained: 0,
      remarks: "",
    };

  const grade = gradeFor(
    current.marksObtained,
    Number(maxMarks) || 100
  );

  const percentage = Math.round(
    (current.marksObtained / (Number(maxMarks) || 1)) * 100
  );

  return (
    <tr
      key={student._id}
      className="transition-all duration-200 hover:bg-indigo-50/40"
    >
      {/* SERIAL */}
      <td className="px-6 py-5 font-semibold text-gray-500">
        {index + 1}
      </td>

      {/* STUDENT */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-bold text-indigo-700">
            {student.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {student.name}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Student
            </p>
          </div>

        </div>
      </td>

      {/* EMAIL */}
      <td className="px-6 py-5">
        <p className="max-w-55 truncate text-sm text-gray-600">
          {student.email}
        </p>
      </td>

      {/* MARKS */}
      <td className="px-6 py-5">

        <div className="space-y-3">

          <div className="flex items-center justify-center gap-3">

            <input
              type="number"
              min="0"
              max={maxMarks}
              value={current.marksObtained}
              onChange={(e) =>
                handleMarksChange(student._id, e.target.value)
              }
              className="h-11 w-24 rounded-xl border border-gray-200 bg-white text-center font-semibold shadow-sm transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600">
              / {maxMarks}
            </span>

          </div>

          <div>

            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">

              <div
                className={`h-full rounded-full transition-all duration-500 ${
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

        </div>

      </td>

      {/* GRADE */}
      <td className="px-6 py-5 text-center">

        <span
          className={`inline-flex min-w-15 items-center justify-center rounded-full border px-4 py-2 text-sm font-bold ${grade.color}`}
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
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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

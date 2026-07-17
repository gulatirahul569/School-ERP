import { useEffect, useState } from "react";
import axios from "../../services/api";

import {
    CalendarCheck,
    Users,
    CheckCircle2,
    XCircle,
    ClipboardCheck,
    CalendarDays,
} from "lucide-react";

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [savedAttendance, setSavedAttendance] =
        useState(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [studentSearch, setStudentSearch] = useState("");

    // ================= FETCH DATA =================

    useEffect(() => {
        fetchClasses();
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
        if (
            selectedClass &&
            date &&
            students.length > 0
        ) {
            fetchAttendance();
        }
    }, [selectedClass, date, students]);

    const fetchClasses = async () => {
        try {
            const res = await axios.get("/class");

            setClasses(
                res.data?.classes ||
                res.data?.data ||
                res.data ||
                []
            );
        } catch (err) {
            console.log(err);
        }
    };

    const fetchClassStudents = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `/class/${selectedClass}`
            );

            const studentList =
                res.data?.students ||
                res.data?.class?.students ||
                res.data?.data?.students ||
                [];

            setStudents(studentList);

            setAttendance(
                studentList.map((student) => ({
                    student: student._id,
                    status: "present",
                }))
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
                `/attendance/by-date?classId=${selectedClass}&date=${date}`
            );

            const records =
                res.data?.attendance?.records || [];

            setSavedAttendance(
                res.data?.attendance || null
            );

            setAttendance(
                students.map((student) => {
                    const found = records.find((r) => {
                        const id =
                            typeof r.student === "object"
                                ? r.student._id
                                : r.student;

                        return id === student._id;
                    });

                    return {
                        student: student._id,
                        status: found?.status || "present",
                    };
                })
            );
        } catch {
            setSavedAttendance(null);

            setAttendance(
                students
                    .filter((student) =>
                        student.name
                            .toLowerCase()
                            .includes(studentSearch.toLowerCase())
                    )
                    .map((student) => ({
                        student: student._id,
                        status: "present",
                    }))
            );
        }
    };

    const handleStatusChange = (
        studentId,
        status
    ) => {
        setAttendance((prev) =>
            prev.map((item) => {
                const id =
                    typeof item.student === "object"
                        ? item.student._id
                        : item.student;

                return id === studentId
                    ? { ...item, status }
                    : item;
            })
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

            setMessage(
                "Attendance saved successfully."
            );

            fetchAttendance();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Failed to save attendance."
            );
        } finally {
            setSaving(false);
        }
    };

    // ================= DASHBOARD STATS =================

    const totalStudents = students.length;

    const presentCount = attendance.filter(
        (a) => a.status === "present"
    ).length;

    const absentCount = attendance.filter(
        (a) => a.status === "absent"
    ).length;

    const attendancePercentage =
        totalStudents > 0
            ? Math.round(
                (presentCount / totalStudents) * 100
            )
            : 0;

    const selectedClassData = classes.find(
        (c) => c._id === selectedClass
    );

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="space-y-6 p-3 sm:p-2 sm:pt-0 animate-fadeIn">

            {/* ================= HEADER ================= */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">

                        <CalendarCheck
                            className="text-indigo-600"
                            size={28}
                        />

                    </div>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Attendance Management
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Track and manage daily attendance for every class.
                        </p>

                        <p className="flex items-center gap-2 mt-2 text-sm text-gray-400">

                            <CalendarDays size={16} />

                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}

                        </p>

                    </div>

                </div>

            </div>

            {/* ================= KPI CARDS ================= */}

            {/* ================= FILTER CARD ================= */}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mt-6">

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Attendance Details
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Select class and attendance date.
                        </p>
                    </div>

                </div>

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Class */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Class
                        </label>

                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">Select Class</option>

                            {classes.map((cls) => (
                                <option
                                    key={cls._id}
                                    value={cls._id}
                                >
                                    Class {cls.name}
                                    {cls.section && ` - ${cls.section}`}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* Date */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Attendance Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                    </div>

                </div>

            </div>

            {/* ================= SUMMARY ================= */}

            {selectedClass && savedAttendance && (

                <div className="grid md:grid-cols-3 gap-5 mt-6">

                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6">

                        <p className="text-green-600 font-medium">
                            Present
                        </p>

                        <h2 className="text-4xl font-bold text-green-700 mt-2">

                            {
                                savedAttendance.records.filter(
                                    r => r.status === "present"
                                ).length
                            }

                        </h2>

                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6">

                        <p className="text-red-600 font-medium">
                            Absent
                        </p>

                        <h2 className="text-4xl font-bold text-red-700 mt-2">

                            {
                                savedAttendance.records.filter(
                                    r => r.status === "absent"
                                ).length
                            }

                        </h2>

                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">

                        <p className="text-indigo-600 font-medium">
                            Total Students
                        </p>

                        <h2 className="text-4xl font-bold text-indigo-700 mt-2">

                            {savedAttendance.records.length}

                        </h2>

                    </div>

                </div>

            )}
            {/* ================= STUDENT LIST ================= */}

            {selectedClass && (

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm mt-6 overflow-hidden">

                    {/* Header */}

                    <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">

                        <div className="flex-1">

                            <h2 className="text-xl font-bold text-gray-900">
                                Student Attendance
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Mark attendance for every student in the selected class.
                            </p>

                            <input
                                type="text"
                                placeholder="Search student..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="mt-4 w-full max-w-sm rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />

                        </div>

                        <div className="px-6 py-3 text-4xl rounded-full bg-indigo-100 text-indigo-700 font-semibold">

                            {filteredStudents.length}

                        </div>

                    </div>

                    {loading ? (

                        <div className="py-20 text-center">

                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>

                            <p className="mt-5 text-gray-500">
                                Loading Students...
                            </p>

                        </div>

                    ) : students.length === 0 ? (

                        <div className="py-20 text-center">

                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">

                                <Users
                                    size={36}
                                    className="text-gray-400"
                                />

                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-700">
                                No Students Found
                            </h3>

                            <p className="mt-2 text-gray-500">
                                This class doesn't have any students yet.
                            </p>

                        </div>

                    ) :  filteredStudents.length === 0 ? (

                    <div className="py-20 text-center">

                        <Users
                            size={40}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 text-xl font-semibold text-gray-700">
                            No Student Found
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Try searching with another name or email.
                        </p>

                    </div>

                    ) : (

                    <>
                        {/* Table */}

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="sticky top-0 bg-gray-50 border-b">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-gray-600">
                                            Student
                                        </th>

                                        <th className="text-left px-6 py-4 text-gray-600">
                                            Email
                                        </th>

                                        <th className="text-center px-6 py-4 text-gray-600">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredStudents.map((student) => {

                                        const current =
                                            attendance.find(
                                                (a) =>
                                                    (typeof a.student === "object"
                                                        ? a.student._id
                                                        : a.student) === student._id
                                            ) || {};

                                        return (

                                            <tr
                                                key={student._id}
                                                className="border-b last:border-0 hover:bg-gray-50 transition"
                                            >

                                                {/* Student */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-4">

                                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">

                                                            {student.name?.charAt(0).toUpperCase()}

                                                        </div>

                                                        <div>

                                                            <h4 className="font-semibold text-gray-900">

                                                                {student.name}

                                                            </h4>

                                                            <p className="text-sm text-gray-500">

                                                                Student

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Email */}

                                                <td className="px-6 py-4 text-gray-500">

                                                    {student.email}

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-4 text-center">

                                                    <select

                                                        value={current.status || "present"}

                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                student._id,
                                                                e.target.value
                                                            )
                                                        }

                                                        className={`rounded-xl px-4 py-2 border font-semibold transition

                      ${current.status === "absent"

                                                                ? "bg-red-50 border-red-200 text-red-700"

                                                                : "bg-green-50 border-green-200 text-green-700"

                                                            }`}
                                                    >

                                                        <option value="present">
                                                            ✅ Present
                                                        </option>

                                                        <option value="absent">
                                                            ❌ Absent
                                                        </option>

                                                    </select>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                        {/* Footer */}

                        <div className="flex justify-between items-center px-6 py-5 border-t bg-gray-50">

                            <div className="text-sm text-gray-500">

                                Showing {filteredStudents.length} of {students.length} student(s)

                            </div>

                            <button

                                onClick={handleSubmit}

                                disabled={saving}

                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-xl font-semibold transition shadow-sm hover:shadow-md"

                            >

                                {saving ? "Saving..." : "Save Attendance"}

                            </button>

                        </div>

                    </>

                    )}

                </div>

            )}
        </div>
    );

};

export default Attendance;


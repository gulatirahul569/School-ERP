import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  Trash2,
  UserPlus,
  PlusCircle,
} from "lucide-react";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");

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

  const stats = [
    {
      title: "Total Classes",
      value: classes.length,
      icon: School,
      color: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Teachers Assigned",
      value: classes.filter((c) => c.classTeacher).length,
      icon: GraduationCap,
      color: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: "Available Teachers",
      value: teachers.length,
      icon: Users,
      color: "bg-amber-100",
      text: "text-amber-600",
    },
  ];

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.section.toLowerCase().includes(search.toLowerCase());

    const matchesSection =
      sectionFilter === "all" ||
      cls.section === sectionFilter;

    return matchesSearch && matchesSection;
  });

  return (
    <div className="space-y-6 p-3 sm:p-2 sm:pt-0 animate-fadeIn">

      <div className="space-y-6">

        {/* Header */}

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">

                <BookOpen
                  size={28}
                  className="text-indigo-600"
                />

              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Class Management
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage classes, teachers and students from one place.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================= KPI CARDS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-sm text-gray-500">
                      {item.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-gray-900">
                      {item.value}
                    </h2>

                  </div>

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                  >

                    <Icon
                      size={28}
                      className={item.text}
                    />

                  </div>

                </div>

              </div>

            );

          })}

        </div>

        {/* ================= CREATE CLASS ================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Create New Class
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Add a new class and section to your school.
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

              <School
                size={24}
                className="text-indigo-600"
              />

            </div>

          </div>

          <form
            onSubmit={createClass}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >

            {/* Class Name */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name
              </label>

              <input
                type="text"
                placeholder="Example: 10"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />

            </div>



            {/* Section */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>

              <input
                type="text"
                placeholder="Example: A"
                value={form.section}
                onChange={(e) =>
                  setForm({
                    ...form,
                    section: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />

            </div>

            {/* Button */}

            <div className="flex items-end">

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
              >
                + Create Class
              </button>

            </div>

          </form>

        </div>
                    {/* ================= SEARCH ================= */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-xl font-semibold pl-2 pb-2">
                Search Classes
              </p>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Search class or section..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >

                  <option value="all">
                    All Sections
                  </option>

                  {[...new Set(classes.map((c) => c.section))].map((section) => (

                    <option
                      key={section}
                      value={section}
                    >
                      Section {section}
                    </option>

                  ))}

                </select>

              </div>

            </div>

        {/* Cards */}

        <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6">

          {filteredClasses.length === 0 ? (

            <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">

              <School
                size={60}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-5 text-2xl font-bold text-gray-700">
                No Classes Found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing the search or create a new class.
              </p>

            </div>

          ) : (

            filteredClasses.map((cls) => (

              <div
                key={cls._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >

                {/* ================= HEADER ================= */}

                <div className="border-b border-gray-100 p-6">

                  <div className="flex justify-between items-start">

                    <div className="flex gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">

                        <School
                          size={28}
                          className="text-indigo-600"
                        />

                      </div>

                      <div>

                        <h2 className="text-2xl font-bold text-gray-900">
                          Class {cls.name}-{cls.section}
                        </h2>

                        <div className="flex items-center gap-3 mt-2">

                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                            Section {cls.section}
                          </span>

                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                            {cls.students.length} Students
                          </span>

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={() => deleteClass(cls._id)}
                      className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition flex items-center justify-center"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                  {/* Stats */}

                  <div className="grid grid-cols-2 gap-4 mt-6">

                    <div className="rounded-xl bg-blue-50 p-4">

                      <p className="text-sm text-gray-500">
                        Students
                      </p>

                      <h3 className="text-2xl font-bold text-blue-700 mt-1">
                        {cls.students.length}
                      </h3>

                    </div>

                    <div className="rounded-xl bg-green-50 p-4">

                      <p className="text-sm text-gray-500">
                        Teacher
                      </p>

                      <h3 className="text-lg font-bold text-green-700 mt-1">

                        {cls.classTeacher
                          ? cls.classTeacher.name
                          : "Not Assigned"}

                      </h3>

                    </div>

                  </div>

                </div>

                {/* ================= TEACHER SECTION ================= */}

                <div className="p-6">

                  <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="font-semibold text-gray-800">
                        Class Teacher
                      </h3>

                      <GraduationCap
                        size={22}
                        className="text-indigo-600"
                      />

                    </div>

                    {cls.classTeacher ? (

                      <div>

                        <p className="font-semibold text-gray-900">
                          {cls.classTeacher.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {cls.classTeacher.email}
                        </p>

                        <button
                          onClick={() => removeTeacher(cls._id)}
                          className="mt-4 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          Remove Teacher
                        </button>

                      </div>

                    ) : (

                      <div className="flex gap-3">

                        <select
                          className="flex-1 rounded-xl border border-gray-300 p-3"
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
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl flex items-center gap-2"
                        >

                          <UserPlus size={18} />

                          Assign

                        </button>

                      </div>

                    )}

                  </div>
                  {/* ================= STUDENTS ================= */}

                  <div className="mt-6">

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h3 className="text-lg font-bold text-gray-900">
                          Students
                        </h3>

                        <p className="text-sm text-gray-500">
                          Assign and manage students in this class
                        </p>

                      </div>

                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                        {cls.students.length} Students
                      </span>

                    </div>

                    {/* ================= ADD STUDENT ================= */}

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 mb-5">

                      <div className="flex items-center gap-3 mb-4">

                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">

                          <PlusCircle
                            size={22}
                            className="text-green-600"
                          />

                        </div>

                        <div>

                          <h4 className="font-semibold text-gray-900">
                            Add Student
                          </h4>

                          <p className="text-sm text-gray-500">
                            Select a student and assign them to this class.
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-col md:flex-row gap-3">

                        <select
                          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
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
                          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl flex items-center justify-center gap-2 transition"
                        >

                          <PlusCircle size={18} />

                          Add Student

                        </button>

                      </div>

                    </div>

                    {/* ================= STUDENT LIST ================= */}

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">

                      {cls.students.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center">

                          <Users
                            size={42}
                            className="mx-auto text-gray-300"
                          />

                          <h4 className="mt-4 text-lg font-semibold text-gray-700">
                            No Students Assigned
                          </h4>

                          <p className="text-gray-500 mt-2">
                            Use the form above to add students.
                          </p>

                        </div>

                      ) : (

                        cls.students.map((student) => (

                          <div
                            key={student._id}
                            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all p-4"
                          >

                            <div className="flex items-center gap-4">

                              {/* Avatar */}

                              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-lg">

                                {student.name?.charAt(0).toUpperCase()}

                              </div>

                              <div>

                                <h4 className="font-semibold text-gray-900">
                                  {student.name}
                                </h4>

                                <p className="text-sm text-gray-500">
                                  {student.email}
                                </p>

                              </div>

                            </div>

                            <button
                              onClick={() =>
                                removeStudent(cls._id, student._id)
                              }
                              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-2"
                            >

                              <Trash2 size={16} />

                              Remove

                            </button>

                          </div>

                        ))

                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );
};

export default Classes;


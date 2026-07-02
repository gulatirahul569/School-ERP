import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  dateOfBirth: "",
  address: "",
  phone: "",
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/user?role=student");
      setStudents(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Name, email and password are required.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post("/user", {
        ...formData,
        role: "student",
      });

      setFormData(EMPTY_FORM);
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to add student"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Students Management</h1>
          <p className="text-gray-500">Manage all students</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-black text-white px-4 py-2 rounded font-medium"
        >
          {showForm ? "Close" : "+ Add Student"}
        </button>
      </div>

      {/* ADD STUDENT FORM */}
      {showForm && (
        <form
          onSubmit={handleAddStudent}
          className="bg-white shadow rounded p-6 space-y-4"
        >
          <h2 className="text-lg font-bold">Add New Student</h2>

          {formError && (
            <p className="text-red-600 text-sm">{formError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Student full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password *
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Login password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Home address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-5 py-2 rounded font-medium disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Student"}
          </button>
        </form>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search students..."
        className="w-full p-3 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full table-fixed">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((student) => (
              <tr
                key={student._id}
                className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedStudent(student)}
              >
                <td className="p-2 font-medium">{student.name}</td>
                <td className="p-2 text-gray-600">{student.email}</td>

                <td className="p-2">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    student
                  </span>
                </td>

                <td className="p-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {student.isActive === false ? "Inactive" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No students found.
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white w-[90%] max-w-md rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Student Details
            </h2>

            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {selectedStudent.name}</p>
              <p><b>Email:</b> {selectedStudent.email}</p>
              <p><b>Phone:</b> {selectedStudent.phone || "—"}</p>
              <p>
                <b>Date of Birth:</b>{" "}
                {selectedStudent.dateOfBirth
                  ? new Date(selectedStudent.dateOfBirth).toLocaleDateString()
                  : "—"}
              </p>
              <p><b>Address:</b> {selectedStudent.address || "—"}</p>
              <p><b>Role:</b> student</p>
            </div>

            <button
              className="mt-5 w-full bg-black text-white py-2 rounded"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStudents;
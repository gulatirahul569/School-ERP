import React, { useEffect, useState } from "react";
import axios from "../../services/API";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">Students Management</h1>
        <p className="text-gray-500">Manage all students</p>
      </div>

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
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
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
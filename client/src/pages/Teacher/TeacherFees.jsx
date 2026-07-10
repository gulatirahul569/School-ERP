import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const TeacherFees = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/class/my-classes")
      .then((res) => setClasses(res.data?.data || []))
      .catch((err) => console.log(err));
  }, []);

  const loadFees = async (id) => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/fee/class/${id}`);
      setData(res.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load fee data");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const id = e.target.value;
    setClassId(id);
    loadFees(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">💰 Student Fees</h1>
        <p className="text-gray-500">Fee status for students in your class</p>
      </div>

      <select value={classId} onChange={handleClassChange} className="border p-2 rounded">
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} - {c.section}
          </option>
        ))}
      </select>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading...</p>}

      {data && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Total Due</th>
                <th className="p-2 text-left">Paid</th>
                <th className="p-2 text-left">Balance</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map(({ student, totalDue, totalPaid, balance }) => (
                <tr key={student._id} className="border-t">
                  <td className="p-2 font-medium">{student.name}</td>
                  <td className="p-2 text-gray-500">{student.phone || "—"}</td>
                  <td className="p-2">₹{totalDue}</td>
                  <td className="p-2 text-green-600">₹{totalPaid}</td>
                  <td className="p-2 font-semibold">₹{balance}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        balance === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {balance === 0 ? "Clear" : "Due"}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      disabled
                      title="WhatsApp reminders will be enabled once the API key is added"
                      className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Send Reminder (soon)
                    </button>
                  </td>
                </tr>
              ))}

              {data.students.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No students in this class yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherFees;
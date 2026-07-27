import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClass();
  }, [id]);

  const fetchClass = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/class/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setClassData(res.data.data || null);
    } catch (err) {
      console.log("ClassDetails error:", err);
    } finally {
      setLoading(false);
    }
  };
const openStudent = async (student) => {
  try {
    const res = await axios.get(`/user/${student._id}`);

    setSelectedStudent(res.data.data);

  } catch (err) {
    console.log("Student details error:", err);
    setSelectedStudent(student);
  }
};
      const closeModal = () => {
        setSelectedStudent(null);
      };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-pulse text-lg">Loading class data...</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-medium">
        Class not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BACK BUTTON */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition text-sm font-medium"
        >
          ← Back
        </button>
      </div>

      {/* HEADER */}
      <div
        className="bg-white rounded-2xl shadow-sm 
       p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {classData.name}
            </h1>
            <p className="text-gray-500 mt-1">
              Section <span className="font-medium">{classData.section}</span>
            </p>
          </div>

          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
            Class ID: {classData._id?.slice(-6)}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-100 hover:bg-gray-200 transition rounded-xl p-5">
            <p className="text-gray-600 text-sm">Students</p>
            <h2 className="text-3xl font-bold text-gray-600 mt-1">
              {classData.students?.length || 0}
            </h2>
          </div>

          <div className="bg-green-100 hover:bg-green-200 transition rounded-xl p-5">
            <p className="text-gray-600 text-sm">Attendance</p>
            <h2 className="text-2xl mt-1">📝 Track</h2>
          </div>

          <div className="bg-orange-100 hover:bg-orange-200 transition rounded-xl p-5">
            <p className="text-gray-600 text-sm">Assignments</p>
            <h2 className="text-2xl mt-1">📚 Manage</h2>
          </div>
        </div>
      </div>

      {/* STUDENTS */}
      <div className="bg-white rounded-2xl shadow-sm  overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Students</h2>

          <span className="text-sm text-gray-500">
            {classData.students?.length || 0} total
          </span>
        </div>

        <div>
          {classData.students?.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No students assigned yet
            </div>
          ) : (
            classData.students?.map((student, index) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">
                      {student.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{student.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => openStudent(student)}
                  className="text-sm bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-lg transition"
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold">Student Details</h2>

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>

                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{selectedStudent.phone || "—"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {selectedStudent.dateOfBirth
                      ? new Date(
                          selectedStudent.dateOfBirth,
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">
                    {selectedStudent.address || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <button
                onClick={closeModal}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetails;

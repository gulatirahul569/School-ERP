import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/API";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/class/my-classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.log("MyClasses error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-lg font-semibold text-gray-500 animate-pulse">
          Loading your classes...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            My Classes
          </h1>

          <p className="text-gray-500 mt-2">
            Classes assigned to you by the administrator.
          </p>
        </div>

        <div className="mt-4 md:mt-0 bg-white shadow rounded-xl px-6 py-3">
          <p className="text-sm text-gray-500">Assigned Classes</p>
          <p className="text-3xl font-bold text-indigo-600">
            {classes.length}
          </p>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-16 text-center">
          <div className="text-6xl mb-4">🏫</div>

          <h2 className="text-2xl font-bold text-gray-700">
            No Classes Assigned
          </h2>

          <p className="text-gray-500 mt-3">
            Ask your administrator to assign a class to you.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white rounded-3xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >

              {/* Header */}
              <div className="bg-linear-to-r from-indigo-600 to-blue-500 text-white p-6">

                <div className="flex justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {cls.name}
                    </h2>

                    <p className="opacity-90">
                      Section {cls.section}
                    </p>
                  </div>

                  <div className="text-5xl">🎓</div>
                </div>

              </div>

              {/* Body */}
              <div className="p-6">

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                    <p className="text-gray-500 text-sm">Students</p>

                    <h3 className="text-3xl font-bold text-indigo-600">
                      {cls.students?.length || 0}
                    </h3>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 text-center">
                    <p className="text-gray-500 text-sm">Teacher</p>
                    <h3 className="text-lg font-bold text-green-600">
                      You
                    </h3>
                  </div>

                </div>

                <div className="mt-6">
                  <Link
                    to={`/teacher/classes/${cls._id}`}
                    className="block w-full bg-indigo-600 hover:bg-indigo-700 transition text-white text-center py-3 rounded-xl font-semibold"
                  >
                    View Class
                  </Link>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default MyClasses;
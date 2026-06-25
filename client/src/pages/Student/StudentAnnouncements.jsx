import { useEffect, useState } from "react";
import axios from "../../services/api";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("/announcement");

        const data = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setAnnouncements(data);
      } catch (err) {
        console.log(err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold">📢 Announcements</h1>
        <p className="text-white/80 text-sm">
          Latest updates from teachers & administration
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto">

        {loading ? (
          <p className="text-gray-500">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border text-center text-gray-500">
            No announcements yet
          </div>
        ) : (
          <div className="space-y-4">

            {announcements.map((a) => (
              <div
                key={a._id}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >

                {/* TITLE + BADGE */}
                <div className="flex justify-between items-start">

                  <h2 className="text-lg font-semibold text-gray-800">
                    {a.title}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      a.type === "global"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {a.type === "global" ? "Global" : "Class"}
                  </span>

                </div>

                {/* MESSAGE */}
                <p className="text-gray-600 mt-3 leading-relaxed">
                  {a.message}
                </p>

                {/* FOOTER */}
                <div className="flex justify-between mt-4 text-xs text-gray-400">

                  <span>
                    By {a.createdBy?.name || "Admin/Teacher"}
                  </span>

                  <span>
                    {new Date(a.createdAt).toLocaleString()}
                  </span>

                </div>

                {/* CLASS TAG (if exists) */}
                {a.classId && (
                  <div className="mt-3 text-xs text-indigo-500 font-medium">
                    Class: {a.classId?.name}{" "}
                    {a.classId?.section ? `- ${a.classId.section}` : ""}
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default StudentAnnouncements;
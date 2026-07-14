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

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: "year", value: 31536000 },
      { label: "month", value: 2592000 },
      { label: "day", value: 86400 },
      { label: "hour", value: 3600 },
      { label: "minute", value: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.value);

      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h1 className="text-2xl font-bold">📢 Announcements</h1>
        <p className="text-gray-500 mt-2">
          Stay updated with the latest notices from teachers and the administration.
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
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                {/* Header */}
                <div className="flex items-center gap-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-semibold shrink-0">
                    {a.createdBy?.name?.charAt(0).toUpperCase() || "A"}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h3 className="font-semibold text-gray-900">
                        {a.createdBy?.name || "Admin"}
                      </h3>

                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${a.type === "global"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {a.type === "global" ? "Global" : "Class"}
                      </span>

                    </div>

                    <p className="text-xs text-gray-500 capitalize">
                      {a.createdBy?.role}
                    </p>

                  </div>

                  {/* Time */}
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {getTimeAgo(a.createdAt)}
                  </span>

                </div>

                {/* Announcement */}
                <div className="mt-5">

                  <h2 className="text-lg font-semibold text-gray-900">
                    {a.title}
                  </h2>

                  <p className="mt-3 text-gray-600 leading-7 whitespace-pre-wrap">
                    {a.message}
                  </p>

                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between text-sm">

                  {a.classId ? (
                    <span className="text-indigo-600 font-medium">
                      📚 {a.classId.name}{" "}
                      {a.classId.section && `- ${a.classId.section}`}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      🌍 Visible to all students
                    </span>
                  )}

                  <span className="text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentAnnouncements;
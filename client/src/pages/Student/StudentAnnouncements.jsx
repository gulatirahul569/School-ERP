import { useEffect, useState } from "react";
import axios from "../../services/api";
import {
  Search,
  Bell,
  Globe,
  BookOpen,
  Pin,
} from "lucide-react";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Filter
  const [filter, setFilter] = useState("all");

  // Read More
  const [expanded, setExpanded] = useState({});

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
  const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
    "bg-purple-100 text-purple-700",
  ];

  const getAvatarColor = (name = "") =>
    avatarColors[name.length % avatarColors.length];
  const isNew = (date) => {
    return Date.now() - new Date(date) < 24 * 60 * 60 * 1000;
  };
  const filteredAnnouncements = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : a.type === filter;

    return matchSearch && matchFilter;
  });
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <div className=" top-0 z-20 bg-gray-50 border-b border-gray-200">

        <div className=" mx-auto pb-6">

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* Left */}
              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Announcements
                </h1>

                <p className="mt-2 text-gray-500">
                  Stay updated with notices from teachers and administration.
                </p>

              </div>

              {/* Right */}
              <div className="text-right">

                <h2 className="text-2xl font-bold text-indigo-600">
                  {announcements.length}
                </h2>

                <p className="text-sm text-gray-500">
                  Total Announcements
                </p>

              </div>

            </div>

            {/* Search */}
            <div className="relative mt-4">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />

            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3 mt-4 flex-wrap">

              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("global")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "global"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
              >
                Global
              </button>

              <button
                onClick={() => setFilter("class")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "class"
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
              >
                Class
              </button>

            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Global
                  </p>

                  <h2 className="text-2xl font-bold mt-2 text-gray-900">
                    {announcements.filter(a => a.type === "global").length}
                  </h2>

                </div>

                <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">

                  <Globe className="text-blue-600" size={22} />

                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Class
                  </p>

                  <h2 className="text-2xl font-bold mt-2 text-gray-900">
                    {announcements.filter(a => a.type === "class").length}
                  </h2>

                </div>

                <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">

                  <BookOpen className="text-green-600" size={22} />

                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Recent (24h)
                  </p>

                  <h2 className="text-2xl font-bold mt-2 text-gray-900">
                    {announcements.filter(a => isNew(a.createdAt)).length}
                  </h2>

                </div>

                <div className="h-11 w-11 rounded-xl bg-red-100 flex items-center justify-center">

                  <Bell className="text-red-600" size={22} />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (

        <div className="space-y-4">

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse"
            >

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-gray-200"></div>

                <div className="flex-1">

                  <div className="h-4 w-40 bg-gray-200 rounded"></div>

                  <div className="h-3 w-24 bg-gray-100 rounded mt-3"></div>

                </div>

              </div>

              <div className="h-5 w-64 bg-gray-200 rounded mt-6"></div>

              <div className="h-3 bg-gray-100 rounded mt-5"></div>
              <div className="h-3 bg-gray-100 rounded mt-3"></div>
              <div className="h-3 w-3/4 bg-gray-100 rounded mt-3"></div>

            </div>
          ))}

        </div>

      ) : filteredAnnouncements.length === 0 ? (

        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">

          <Bell
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-2xl font-semibold text-gray-800">
            No Announcements Found
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing your search or filter.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {filteredAnnouncements.map((a) => (

            <div
              key={a._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Header */}

              <div className="p-4 pl-6 pr-6 ">

                <div className="flex items-start gap-4">

                  {/* Avatar */}

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getAvatarColor(
                      a.createdBy?.name
                    )}`}
                  >
                    {a.createdBy?.name?.charAt(0).toUpperCase() || "A"}
                  </div>

                  {/* User */}

                  <div className="flex-1">

                    <div className="flex items-center gap-2 flex-wrap">

                      <h3 className="font-semibold text-gray-900">
                        {a.createdBy?.name || "Admin"}
                      </h3>

                      <span className="text-xs text-gray-500 capitalize">
                        • {a.createdBy?.role}
                      </span>

                      {isNew(a.createdAt) && (
                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-semibold">
                          NEW
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {getTimeAgo(a.createdAt)}
                    </p>

                  </div>

                  {/* Badge */}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${a.type === "global"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {a.type}
                  </span>

                </div>
                <div className="mt-4">

                  <h2 className="text-xl font-semibold text-gray-900">
                    {a.title}
                  </h2>

                  <p
                    className={`mt-2 text-gray-600 leading-8 ${expanded[a._id] ? "" : "line-clamp-3"
                      }`}
                  >
                    {a.message}
                  </p>

                  {a.message.length > 180 && (

                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [a._id]: !prev[a._id],
                        }))
                      }
                      className="mt-3 text-indigo-600 text-sm font-medium hover:underline"
                    >
                      {expanded[a._id]
                        ? "Show Less"
                        : "Read More"}
                    </button>

                  )}

                </div>
                {/* Footer */}
                <div className=" pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* Left */}
                  <div className="flex items-center gap-4 flex-wrap">

                    {a.classId ? (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">

                        <BookOpen size={15} />

                        <span>
                          {a.classId.name}
                          {a.classId.section && ` - ${a.classId.section}`}
                        </span>

                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">

                        <Globe size={15} />

                        <span>Visible to everyone</span>

                      </div>
                    )}

                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-5 text-gray-400 text-sm">

                    <div className="flex items-center gap-1">

                      📅

                      <span>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>

                    </div>

                    <div className="flex items-center gap-1">

                      <Pin size={14} />

                      <span>
                        Notice
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
);
};
export default StudentAnnouncements;
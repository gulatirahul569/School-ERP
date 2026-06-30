import { useEffect, useState } from "react";
import axios from "../../services/api";

const TeacherAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("global");
  const [classId, setClassId] = useState("");

  const [classes, setClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchAnnouncements();
  }, []);

const fetchClasses = async () => {
  try {
    const res = await axios.get("/class/my-classes");

    setClasses(res.data?.data || []);
  } catch (err) {
    console.log(err);
    setClasses([]);
  }
};

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSuccess("");

      await axios.post("/announcement", {
        title,
        message,
        type,
        classId: type === "class" ? classId : null,
      });

      setSuccess("Announcement created successfully.");

      setTitle("");
      setMessage("");
      setType("global");
      setClassId("");

      fetchAnnouncements();
    } catch (err) {
      console.log(err);
      setSuccess(
        err.response?.data?.message ||
          "Failed to create announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold">
          Teacher Announcements
        </h1>
        <p className="text-white/80">
          Create and manage announcements for students.
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">

        <h2 className="text-lg font-semibold mb-5">
          Create Announcement
        </h2>

        {success && (
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              placeholder="Announcement title"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Message
            </label>

            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              placeholder="Write announcement..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-medium">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="global">
                  Global
                </option>
                <option value="class">
                  Class
                </option>
              </select>
            </div>

            {type === "class" && (
              <div>
                <label className="block mb-2 font-medium">
                  Select Class
                </label>

                <select
                  required
                  value={classId}
                  onChange={(e) =>
                    setClassId(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="">
                    Select Class
                  </option>

                  {classes.map((cls) => (
                    <option
                      key={cls._id}
                      value={cls._id}
                    >
                      {cls.name}
                      {cls.section
                        ? ` - ${cls.section}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

          </div>

          <div className="flex justify-end">
            <button
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition"
            >
              {saving
                ? "Publishing..."
                : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>

      {/* ANNOUNCEMENTS */}

      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <h2 className="text-xl font-semibold mb-5">
          All Announcements
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No announcements available.
          </div>
        ) : (
          <div className="space-y-5">

            {announcements.map((a) => (
              <div
                key={a._id}
                className="border rounded-2xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {a.title}
                    </h3>

                    <p className="mt-3 text-gray-600">
                      {a.message}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      a.type === "global"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {a.type === "global"
                      ? "Global"
                      : "Class"}
                  </span>

                </div>

                {a.classId && (
                  <div className="mt-3 text-sm text-indigo-600">
                    Class: {a.classId?.name}
                    {a.classId?.section
                      ? ` - ${a.classId.section}`
                      : ""}
                  </div>
                )}

                <div className="mt-4 flex justify-between text-xs text-gray-400">
                  <span>
                    By{" "}
                    {a.createdBy?.name ||
                      "Teacher"}
                  </span>

                  <span>
                    {new Date(
                      a.createdAt
                    ).toLocaleString()}
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

export default TeacherAnnouncement;
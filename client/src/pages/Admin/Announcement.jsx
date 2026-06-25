import { useEffect, useState } from "react";
import axios from "../../services/api";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [classId, setClassId] = useState("");

  const [classes, setClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // =========================
  // FETCH CLASSES
  // =========================
  const fetchClasses = async () => {
    try {
      const res = await axios.get("/class");

      const raw = res.data;

      const classList =
        raw?.classes ||
        raw?.data?.classes ||
        raw?.data ||
        [];

      setClasses(Array.isArray(classList) ? classList : []);
    } catch (err) {
      console.error(err);
      setClasses([]);
    }
  };

  // =========================
  // FETCH ANNOUNCEMENTS (FIXED)
  // =========================
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/announcement");

      console.log("ANNOUNCEMENTS API:", res.data);

      const list =
        res.data?.data ||
        res.data?.announcements ||
        (Array.isArray(res.data) ? res.data : []);

      setAnnouncements(list);
    } catch (err) {
      console.error(err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchAnnouncements();
  }, []);

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMsg("");

      await axios.post("/announcement", {
        title,
        message,
        classId: classId || null,
      });

      setMsg("Announcement created successfully");

      setTitle("");
      setMessage("");
      setClassId("");

      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Failed to create announcement");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/announcement/${id}`);
      setMsg("Deleted successfully");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          Announcements
        </h1>

        {/* MESSAGE */}
        {msg && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
            {msg}
          </div>
        )}

        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Create Announcement
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-3 rounded-lg"
              rows="4"
              required
            />

            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Global Announcement</option>

              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  Class {cls.name}
                  {cls.section ? ` - ${cls.section}` : ""}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
            >
              {saving ? "Creating..." : "Create Announcement"}
            </button>

          </form>
        </div>

        {/* LIST */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            All Announcements
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : announcements.length === 0 ? (
            <p>No announcements found</p>
          ) : (
            <div className="space-y-4">

              {announcements.map((a) => (
                <div key={a._id} className="border p-4 rounded-lg">

                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {a.title}
                    </h3>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-gray-600 mt-2">
                    {a.message}
                  </p>

                  <div className="text-xs text-gray-400 mt-2">
                    {a.type === "global"
                      ? "Global"
                      : a.classId
                        ? `Class: ${a.classId.name}`
                        : "Class Announcement"}
                    {" • "}
                    By {a.createdBy?.name || "Admin/Teacher"}
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Announcement; 
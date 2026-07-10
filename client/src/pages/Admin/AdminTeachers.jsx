import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { SUBJECTS } from "../../constants/subjects";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  dateOfBirth: "",
  address: "",
  phone: "",
  subjects: [],
};

// Turns "2024-05-01T00:00:00.000Z" into "2024-05-01" so it can sit inside
// an <input type="date" /> value without React complaining.
const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const toggleSubject = (list, subject) =>
  list.includes(subject) ? list.filter((s) => s !== subject) : [...list, subject];

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // ---- EDIT MODE (used inside the details modal) ----
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(EMPTY_FORM);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/user?role=teacher");
      setTeachers(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async (e) => {
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
        role: "teacher",
      });

      setFormData(EMPTY_FORM);
      setShowForm(false);
      fetchTeachers();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to add teacher"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Open the details modal in read-only mode ----
  const openTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(false);
    setEditError("");
  };

  const closeModal = () => {
    setSelectedTeacher(null);
    setIsEditing(false);
    setEditError("");
  };

  // ---- Switch the modal into edit mode, pre-filled with current data ----
  const startEditing = (teacher) => {
    const target = teacher || selectedTeacher;
    setEditFormData({
      name: target.name || "",
      email: target.email || "",
      password: "", // left blank on purpose - only sent if admin types one
      dateOfBirth: toDateInputValue(target.dateOfBirth),
      address: target.address || "",
      phone: target.phone || "",
      subjects: target.subjects || [],
    });
    setEditError("");
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editFormData.name || !editFormData.email) {
      setEditError("Name and email are required.");
      return;
    }

    try {
      setEditSubmitting(true);

      // Don't send an empty password - the backend only changes it if present.
      const payload = { ...editFormData };
      if (!payload.password) delete payload.password;

      const res = await axios.put(`/user/${selectedTeacher._id}`, payload);
      const updated = res.data?.data;

      setTeachers((prev) =>
        prev.map((t) => (t._id === selectedTeacher._id ? updated : t))
      );
      setSelectedTeacher(updated);
      setIsEditing(false);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Failed to update teacher"
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (
      !window.confirm(
        `Delete ${selectedTeacher.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await axios.delete(`/user/${selectedTeacher._id}`);
      setTeachers((prev) =>
        prev.filter((t) => t._id !== selectedTeacher._id)
      );
      closeModal();
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Failed to delete teacher"
      );
    } finally {
      setDeleting(false);
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Teachers Management</h1>
          <p className="text-gray-500">Manage all teachers</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-black text-white px-4 py-2 rounded font-medium"
        >
          {showForm ? "Close" : "+ Add Teacher"}
        </button>
      </div>

      {/* ADD TEACHER FORM */}
      {showForm && (
        <form
          onSubmit={handleAddTeacher}
          className="bg-white shadow rounded p-6 space-y-4"
        >
          <h2 className="text-lg font-bold">Add New Teacher</h2>

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
                placeholder="Teacher full name"
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
                placeholder="teacher@example.com"
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

          <div>
            <label className="block text-sm font-medium mb-1">Subjects Taught</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <label key={s} className="flex items-center gap-1 text-sm border px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(s)}
                    onChange={() =>
                      setFormData({ ...formData, subjects: toggleSubject(formData.subjects, s) })
                    }
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-5 py-2 rounded font-medium disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Teacher"}
          </button>
        </form>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search teachers..."
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
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((teacher) => (
              <tr
                key={teacher._id}
                className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() => openTeacher(teacher)}
              >
                <td className="p-2 font-medium">{teacher.name}</td>
                <td className="p-2 text-gray-600">{teacher.email}</td>

                <td className="p-2">
                  <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                    teacher
                  </span>
                </td>

                <td className="p-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {teacher.isActive === false ? "Inactive" : "Active"}
                  </span>
                </td>

                <td className="p-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTeacher(teacher);
                      startEditing(teacher);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No teachers found.
          </div>
        )}
      </div>

      {/* MODAL: VIEW / EDIT / DELETE */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white w-[90%] max-w-md rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {isEditing ? "Edit Teacher" : "Teacher Details"}
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => startEditing()}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateTeacher} className="space-y-3">
                {editError && (
                  <p className="text-red-600 text-sm">{editError}</p>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={editFormData.password}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={editFormData.dateOfBirth}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subjects Taught</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => (
                      <label key={s} className="flex items-center gap-1 text-sm border px-2 py-1 rounded">
                        <input
                          type="checkbox"
                          checked={editFormData.subjects.includes(s)}
                          onChange={() =>
                            setEditFormData({
                              ...editFormData,
                              subjects: toggleSubject(editFormData.subjects, s),
                            })
                          }
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="flex-1 bg-black text-white py-2 rounded font-medium disabled:opacity-50"
                  >
                    {editSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border py-2 rounded font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-2 text-sm">
                  <p><b>Name:</b> {selectedTeacher.name}</p>
                  <p><b>Email:</b> {selectedTeacher.email}</p>
                  <p><b>Phone:</b> {selectedTeacher.phone || "—"}</p>
                  <p>
                    <b>Date of Birth:</b>{" "}
                    {selectedTeacher.dateOfBirth
                      ? new Date(selectedTeacher.dateOfBirth).toLocaleDateString()
                      : "—"}
                  </p>
                  <p><b>Address:</b> {selectedTeacher.address || "—"}</p>
                  <p><b>Subjects:</b> {selectedTeacher.subjects?.length ? selectedTeacher.subjects.join(", ") : "—"}</p>
                  <p><b>Role:</b> teacher</p>
                </div>

                {editError && (
                  <p className="text-red-600 text-sm mt-2">{editError}</p>
                )}

                <div className="flex gap-2 mt-5">
                  <button
                    className="flex-1 bg-black text-white py-2 rounded"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeleteTeacher}
                    className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTeachers;
import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right">
      {value || "—"}
    </span>
  </div>
);

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/user/profile");
      setProfile(res.data?.user || null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-10 text-center space-y-3">
        <p className="text-red-600 font-medium">
          {error || "Unable to load profile."}
        </p>
        <button
          onClick={fetchProfile}
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isActive = profile.isActive !== false;
  const className = profile.classId
    ? `${profile.classId.name}${
        profile.classId.section ? " - " + profile.classId.section : ""
      }`
    : "Not assigned";

  return (
    <div className="space-y-6">

      {/* HEADER / BANNER */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-3xl shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shrink-0">
            {initials(profile.name) || "?"}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {profile.name}
            </h1>
            <p className="text-white/80 mt-1 truncate">{profile.email}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20">
                Student
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isActive
                    ? "bg-green-400/30 text-white"
                    : "bg-red-400/30 text-white"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20">
                {className}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-indigo-100 rounded-3xl p-6">
          <p className="text-indigo-600 text-sm">Class</p>
          <h2 className="text-2xl font-bold mt-2 truncate">{className}</h2>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6">
          <p className="text-yellow-700 text-sm">Date of Birth</p>
          <h2 className="text-2xl font-bold mt-2">
            {formatDate(profile.dateOfBirth)}
          </h2>
        </div>

        <div className="bg-indigo-100 rounded-3xl p-6">
          <p className="text-indigo-600 text-sm">Joined</p>
          <h2 className="text-2xl font-bold mt-2">
            {formatDate(profile.createdAt)}
          </h2>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
          <div>
            <InfoRow label="Full Name" value={profile.name} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.phone} />
            <InfoRow
              label="Date of Birth"
              value={formatDate(profile.dateOfBirth)}
            />
            <InfoRow label="Address" value={profile.address} />
          </div>
        </div>

        {/* ACADEMIC INFO */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Academic Information</h2>
          <div>
            <InfoRow label="Role" value="Student" />
            <InfoRow label="Class" value={className} />
            <InfoRow
              label="Status"
              value={isActive ? "Active" : "Inactive"}
            />
            <InfoRow label="Joined On" value={formatDate(profile.createdAt)} />
          </div>

          <div className="mt-4 bg-indigo-50 text-indigo-700 text-xs rounded-2xl p-4">
            These details are added and maintained by your school admin.
            If anything here looks incorrect, please contact the school
            office to have it corrected.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
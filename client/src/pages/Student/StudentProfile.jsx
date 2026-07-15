import React, { useEffect, useState } from "react";
import axios from "../../services/api";

import {
  User,
  Mail,
  Phone,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
  MapPin,
  School,
  BadgeCheck,
} from "lucide-react";

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

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">

    <div className="flex items-center gap-3">

      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
        {icon}
      </div>

      <span className="text-gray-600 font-medium">
        {label}
      </span>

    </div>

    <span className="font-semibold text-gray-800 text-right">
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
        err.response?.data?.message ||
        "Failed to load profile"
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-50 p-6">

        <div className="max-w-7xl mx-auto animate-pulse space-y-6">

          <div className="h-56 rounded-3xl bg-white"></div>

          <div className="grid md:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-3xl bg-white"
              />
            ))}

          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            <div className="h-96 rounded-3xl bg-white"></div>

            <div className="h-96 rounded-3xl bg-white"></div>

          </div>

        </div>

      </div>

    );

  }

  if (error || !profile) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

          <h2 className="text-2xl font-bold text-red-600">
            {error || "Unable to load profile"}
          </h2>

          <button
            onClick={fetchProfile}
            className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-black hover:bg-indigo-700 transition"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }

  const isActive = profile.isActive !== false;

  const className = profile.classId
    ? `${profile.classId.name}${profile.classId.section
      ? " - " + profile.classId.section
      : ""
    }`
    : "Not Assigned";
  return (
    <div className="min-h-screen bg-gray-50  mt-0 p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden rounded-3xl  p-8 shadow-xl text-black">

          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}

            <div className="flex items-center gap-6">

              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border border-white/30 shadow-lg">

                {initials(profile.name)}

              </div>

              <div>

                <h1 className="text-2xl font-bold">
                  {profile.name}
                </h1>

                <p className="mt-2 flex items-center gap-2 text-black/80">

                  <Mail size={17} />

                  {profile.email}

                </p>

                <div className="flex flex-wrap gap-3 mt-5">

                  <span className="px-4 py-1 rounded-full bg-white/20 text-sm">
                    Student
                  </span>

                  <span
                    className={`px-4 py-1 rounded-full text-sm ${isActive
                        ? "bg-green-500"
                        : "bg-red-500"
                      }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>

                  <span className="px-4 py-1 rounded-full bg-white/20 text-sm">

                    {className}

                  </span>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="text-center">

              <p className="text-black/70">
                Student ID
              </p>

              <h2 className="text-2xl font-bold mt-2 tracking-wider">

                {profile._id?.slice(-6).toUpperCase()}

              </h2>

            </div>

          </div>

        </div>

        {/* ================= KPI CARDS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-gray-500">
                  Class
                </p>

                <h2 className="mt-2 text-sm font-bold text-gray-900">

                  {className}

                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">

                <School
                  size={28}
                  className="text-indigo-600"
                />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-gray-500">
                  Date of Birth
                </p>

                <h2 className="mt-2 text-sm font-bold text-gray-900">

                  {formatDate(profile.dateOfBirth)}

                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                <CalendarDays
                  size={28}
                  className="text-yellow-600"
                />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-gray-500">
                  Joined
                </p>

                <h2 className="mt-2 text-sm font-bold text-gray-900">

                  {formatDate(profile.createdAt)}

                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                <GraduationCap
                  size={28}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <h2
                  className={`mt-2 text-lg font-bold ${isActive
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isActive
                    ? "bg-green-100"
                    : "bg-red-100"
                  }`}
              >

                <BadgeCheck
                  size={28}
                  className={
                    isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />

              </div>

            </div>

          </div>

        </div>

        {/* ================= DETAILS ================= */}

        <div className="grid lg:grid-cols-2 gap-4">

          {/* ================= PERSONAL INFORMATION ================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Basic personal details
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">

                <User
                  size={24}
                  className="text-indigo-600"
                />

              </div>

            </div>

            <InfoRow
              icon={<User size={18} />}
              label="Full Name"
              value={profile.name}
            />

            <InfoRow
              icon={<Mail size={18} />}
              label="Email Address"
              value={profile.email}
            />

            <InfoRow
              icon={<Phone size={18} />}
              label="Phone Number"
              value={profile.phone}
            />

            <InfoRow
              icon={<CalendarDays size={18} />}
              label="Date of Birth"
              value={formatDate(profile.dateOfBirth)}
            />

            <InfoRow
              icon={<MapPin size={18} />}
              label="Address"
              value={profile.address}
            />

          </div>

          {/* ================= ACADEMIC INFORMATION ================= */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Academic Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  School related information
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">

                <GraduationCap
                  size={24}
                  className="text-green-600"
                />

              </div>

            </div>

            <InfoRow
              icon={<School size={18} />}
              label="Class"
              value={className}
            />

            <InfoRow
              icon={<ShieldCheck size={18} />}
              label="Role"
              value="Student"
            />

            <InfoRow
              icon={<BadgeCheck size={18} />}
              label="Status"
              value={isActive ? "Active" : "Inactive"}
            />

            <InfoRow
              icon={<CalendarDays size={18} />}
              label="Joined On"
              value={formatDate(profile.createdAt)}
            />

            <div className="mt-8 rounded-2xl bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-5">

              <h3 className="font-semibold text-indigo-700 mb-2">
                School Notice
              </h3>

              <p className="text-sm leading-7 text-gray-600">

                Your profile information is managed by the school administration.
                If you notice any incorrect details such as your name, phone
                number, class, or date of birth, please contact the school office
                for corrections.

              </p>

            </div>

          </div>

        </div>
        
      </div>
    </div>
   ); 
};

        export default StudentProfile;
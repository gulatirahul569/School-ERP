import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData
      );

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/8617938/pexels-photo-8617938.jpeg ')",
        }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center block sm:hidden"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/37795369/pexels-photo-37795369.jpeg')",
        }}
      />

      <div className="absolute inset-0 bg-black/50"></div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10
          w-[90%] sm:w-95 md:w-105
          p-6 sm:p-8
          rounded-2xl
          bg-white/15 backdrop-blur-md
          border border-white/20
          shadow-2xl
        "
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white">
          Register
        </h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white border border-white/30"
        />

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white border border-white/30"
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white border border-white/30"
        />

        {/* ROLE (SAFE VERSION) */}
        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          className="w-full p-3 mb-5 rounded-lg bg-white/20 text-black"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>

        {/* BUTTON */}
        <button className="w-full bg-white text-black py-3 rounded-lg font-semibold">
          Register
        </button>

        <p className="text-center text-white mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
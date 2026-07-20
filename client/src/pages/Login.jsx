import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email, password);

      alert("Login successful");

      // ROLE BASED REDIRECT
      if (user.role === "student") navigate("/student");
      else if (user.role === "admin") navigate("/admin");
      else if (user.role === "teacher") navigate("/teacher");
      else if (user.role === "parent") navigate("/parent");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };return (
  <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center p-4 lg:p-10 relative overflow-hidden">

    {/* Mobile Background */}
    <div
      className="absolute inset-0 lg:hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/login.png')",
      }}
    />

    {/* Mobile Overlay */}
    <div className="absolute inset-0 lg:hidden bg-black/40 backdrop-blur-[2px]" />

    {/* Desktop Card */}
    <div
      className="
      relative z-10
      w-full
      max-w-6xl

      lg:bg-white
      lg:rounded-[34px]
      lg:shadow-[0_25px_60px_rgba(0,0,0,0.08)]

      overflow-hidden
      grid
      lg:grid-cols-[58%_42%]
      "
    >
      {/* LEFT IMAGE */}
      <div className="hidden lg:flex items-center justify-center p-8 bg-white">
        <img
          src="/login.png"
          alt="login"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:px-16 lg:py-12">

        <form
          onSubmit={handleSubmit}
          className="
          w-full
          max-w-md

          lg:bg-transparent

          bg-white/15
          backdrop-blur-xl
          border
          border-white/20
          rounded-3xl

          p-7
          sm:p-8
          lg:p-0

          shadow-2xl
          lg:shadow-none
          "
        >

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center text-white">
              📚
            </div>

            <p className="font-semibold text-lg lg:text-slate-800 text-white">
              Management System
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">

            <h1 className="text-3xl lg:text-4xl font-bold lg:text-gray-900 text-white">
              Welcome Back
            </h1>

            <p className="mt-3 lg:text-gray-500 text-white/80">
              Sign in to continue to your account.
            </p>

          </div>

          {/* EMAIL */}

          <div className="mb-5">

            <label className="block text-sm mb-2 font-medium lg:text-gray-700 text-white">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="
              w-full
              rounded-xl
              border

              lg:border-gray-300
              border-white/30

              lg:bg-white
              bg-white/15

              lg:text-black
              text-white

              placeholder:text-white/70
              lg:placeholder:text-gray-400

              px-5
              py-4

              outline-none
              transition

              focus:ring-4
              focus:ring-sky-300
              "
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-8">

            <label className="block text-sm mb-2 font-medium lg:text-gray-700 text-white">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="
              w-full
              rounded-xl
              border

              lg:border-gray-300
              border-white/30

              lg:bg-white
              bg-white/15

              lg:text-black
              text-white

              placeholder:text-white/70
              lg:placeholder:text-gray-400

              px-5
              py-4

              outline-none
              transition

              focus:ring-4
              focus:ring-sky-300
              "
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            py-4
            rounded-xl
            font-semibold

            bg-sky-600
            hover:bg-sky-700

            text-white

            transition
            disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  </div>
);
};
export default Login
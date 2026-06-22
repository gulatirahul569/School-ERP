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
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      {/* DESKTOP BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=3000')",
        }}
      />

      {/* MOBILE BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center block sm:hidden"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/8485650/pexels-photo-8485650.jpeg')",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* LOGIN BOX */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10
          w-[90%] sm:w-96 md:w-105
          p-6 sm:p-8
          rounded-2xl
          bg-white/15 backdrop-blur-md
          border border-white/20
          shadow-2xl
        "
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white">
          Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30 outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30 outline-none"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full bg-white text-black py-3 rounded-lg
            font-semibold
            hover:bg-zinc-200
            active:scale-[0.98]
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* LINK */}
        <p className="text-center text-white mt-5 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-300 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
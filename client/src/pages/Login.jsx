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
    <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center p-10">
      <div
        className="
w-full
max-w-6xl
max-h-
bg-white
rounded-[34px]
shadow-[0_25px_60px_rgba(0,0,0,0.08)]
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
            className="w-full  rounded-3xl object-cover"
          />
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
flex
items-center
justify-center
px-16
py-12
"
        >
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                  📚
                </div>

                <div>
                  <p className="font-semibold text-slate-800">Management System</p>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>

              <p className="text-gray-500 mt-3">
                Sign in to continue to your account.
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                border-gray-300
                px-5
                py-4
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                border-gray-300
                px-5
                py-4
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-black
              hover:bg-gray-900
              text-white
              py-4
              rounded-xl
              font-semibold
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
export default Login;

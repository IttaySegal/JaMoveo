import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) throw new Error("User data not found");

      const userData = userDoc.data();
      login(userData);
      navigate(userData.role === "admin" ? "/admin" : "/player");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-center text-blue-600">Welcome to Moveo</h1>
          <h2 className="text-lg text-center text-gray-600 mt-2">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && <div className="text-sm text-red-600 text-center">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Don't have an account?</p>
          <div className="mt-2 flex justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Sign up as Player
            </button>
            <button
              onClick={() => navigate("/signup-admin")}
              className="px-4 py-1 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-100 transition"
            >
              Sign up as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

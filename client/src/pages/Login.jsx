// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import api from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import bgImage from "../assets/login-bg.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={submit}
        className="bg-white/95 backdrop-blur-sm w-full max-w-md space-y-6"
        style={{
          padding: '2.5rem', // 40px
          margin: '1.5rem',   // 24px
          borderRadius: '1rem', // 16px
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-600 mb-0">See your growth and get support!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
            Email
        </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              marginBottom: '0',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#1e3a8a',
                  position: 'relative',
                  top: '7px'
                }}
              /> 
              <span className="text-gray-700 relative left-[-65px] ">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '12px 16px',
            marginTop: '10px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 relative top-[15px]">
          Not registered yet?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create a new account
          </Link>
        </p>
      </form>
    </div>
  );
}
import React, { useState } from "react";
import axios from "../api/axios.ts";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("/auth/register", {
        name: form.username,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      setSuccess(
        "Registration successful! Your account is pending superadmin approval. You can log in once activated."
      );
      setForm({ username: "", email: "", password: "" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card card glass-panel">
        <div className="register-header">
          <div className="register-icon">
            <UserPlus size={36} />
          </div>
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">
            Join Expense-Tracker to manage your finances
          </p>
        </div>

        {error && (
          <div className="register-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="register-success">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-input"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="form-group register-form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary register-submit-btn"
          >
            Register
          </button>
        </form><br/>
        <p className="register-link text-center mt-3 text-white"> Already have an account?{" "}<a href="/login" style={{ textDecoration: "none" }}>Login</a>
        </p>      
      </div>
    </div>
  )
};

export default Register;

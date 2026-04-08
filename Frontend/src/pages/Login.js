import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, AlertCircle, HelpCircle, CheckCircle } from "lucide-react";
import api from "../api/axios";
import "../styles/Login.css";

const Login = () => {
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        typeof err === "string" ? err : "Login failed. Check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(false);
    setResetLoading(true);

    try {
      await api.post("/auth/request-password-reset", {
        email: resetEmail,
      });

      setResetSuccess(true);
      setResetEmail("");
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
      }, 3000);
    } catch (err) {
      setResetError(
        err.response?.data?.message || "Failed to submit password reset request"
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card glass-panel">
        <div className="login-header">
          <h2 className="login-title">
            ExpenseTracker
          </h2>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group login-form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <LogIn size={20} /> Sign In
              </>
            )}
          </button>

          <div className="login-footer-actions">
            <a href="/register" className="login-action-link register-btn">
              Register Account
            </a>
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => {
                setShowForgotModal(true);
                setResetError(null);
                setResetSuccess(false);
              }}
            >
              <HelpCircle size={18} /> Forgot Password?
            </button>
          </div>

          <p className="text-sm login-info-text" style={{ marginTop: "1rem" }}>
            Your account will require superadmin approval before you can log in.
          </p>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Forgot Password?
              </h3>
              <button
                className="btn btn-outline"
                style={{ padding: "0.25rem 0.5rem", border: "none" }}
                onClick={() => {
                  setShowForgotModal(false);
                  setResetEmail("");
                  setResetError(null);
                  setResetSuccess(false);
                }}
              >
                ✕
              </button>
            </div>

            {resetSuccess ? (
              <div className="modal-body">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "2rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <CheckCircle size={48} color="#16a34a" />
                  <h4 style={{ color: "#16a34a", marginBottom: "0.5rem" }}>
                    Request Submitted!
                  </h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    Your password reset request has been sent to the Superadmin.
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    They will verify and set a new password for you shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="modal-body">
                {resetError && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      color: "#dc2626",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <AlertCircle size={16} />
                    {resetError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">
                    Registered Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.5rem",
                    }}
                  >
                    Enter your registered email address. The Superadmin will review your request and set a new password.
                  </p>
                </div>

                <div className="modal-form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowForgotModal(false);
                      setResetEmail("");
                      setResetError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

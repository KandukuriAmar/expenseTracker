import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Moon, Sun, Wallet } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // If not logged in, don't show the main navbar controls (except maybe logo and theme toggle)
  if (!user) {
    return (
      <nav
        className="glass-panel"
        style={{
          margin: "1rem",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "var(--gradient-primary)",
          }}
        >
          <Wallet size={28} />
          Expense-Tracker
        </div>
        <button className="btn btn-outline" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
    );
  }

  return (
    <nav
      className="glass-panel"
      style={{
        margin: "1rem",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontWeight: "bold",
          fontSize: "1.25rem",
          color: "var(--text-primary)",
        }}
      >
        <span>Expense-Tracker</span>
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {/* Navigation Links based on Role */}
        <Link
          to="/"
          className={`btn btn-outline ${location.pathname === "/" ? "active-link" : ""}`}
          style={
            location.pathname === "/"
              ? { background: "var(--input-bg)" }
              : { border: "none" }
          }
        >
          Dashboard
        </Link>

        {user.role === "superadmin" && (
          <>
            <Link
              to="/superadmin"
              className={`btn btn-outline`}
              style={
                location.pathname === "/superadmin"
                  ? { background: "var(--input-bg)" }
                  : { border: "none" }
              }
            >
              Manage Admins
            </Link>
            <Link
              to="/all-transactions"
              className={`btn btn-outline`}
              style={
                location.pathname === "/all-transactions"
                  ? { background: "var(--input-bg)" }
                  : { border: "none" }
              }
            >
              All Transactions
            </Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          className="btn btn-outline"
          onClick={toggleTheme}
          style={{ padding: "0.5rem 0.75rem" }}
        >
          {theme === "light" ? (
            <>
              <Moon size={16} /> Light
            </>
          ) : (
            <>
              <Sun size={16} /> Dark
            </>
          )}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "var(--input-bg)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
            {user.name}
          </span>
          <span
            className="badge badge-active"
            style={{ marginLeft: "0.5rem", fontSize: "0.65rem" }}
          >
            {user.role}
          </span>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

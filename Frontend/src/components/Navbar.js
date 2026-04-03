import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Moon, Sun, Wallet } from "lucide-react";
import "../styles/Navbar.css";

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

  if (!user) {
    return (
      <nav className="glass-panel navbar-guest">
        <div className="navbar-logo-text">
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
    <nav className="glass-panel navbar-container">
      <Link to="/" className="navbar-brand">
        <span>Expense-Tracker</span>
      </Link>

      <div className="navbar-nav">
        <Link
          to="/"
          className={`btn btn-outline navbar-link ${location.pathname === "/" ? "active-link" : ""}`}
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
              className="btn btn-outline navbar-link"
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
              className="btn btn-outline navbar-link"
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

      <div className="navbar-nav">
        <button className="btn btn-outline navbar-theme-btn" onClick={toggleTheme}>
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

        <div className="navbar-user-info">
          <span className="navbar-username">{user.name}</span>
          <span className="badge badge-active navbar-role-badge">{user.role}</span>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

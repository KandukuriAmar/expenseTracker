import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

// Create Context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const meRes = await api.get("/auth/me");
        setUser(meRes.data?.user || null);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem("token");
    };

    initializeAuth();
    window.addEventListener("jwt-unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("jwt-unauthorized", handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data?.user || null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const meRes = await api.get("/auth/me", {
          withCredentials: true,
        });
        setUser(meRes.data?.user || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const meRes = await api.get("/auth/me", {
        withCredentials: true,
      });

      setUser(meRes.data?.user || null);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
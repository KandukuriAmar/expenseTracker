import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/utilities.css";
// Pages

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminPanel from "./pages/SuperAdminPanel";
import AllTransactions from "./pages/AllTransactions";

function FallbackRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Navigate to={user ? "/" : "/login"} replace />;
}

function RoleBasedHome() {
  const { user } = useAuth();
  return user?.role === "superadmin" ? <SuperAdminDashboard /> : <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <RoleBasedHome />
                  </PrivateRoute>
                }
              />

              <Route
                path="/superadmin"
                element={
                  <PrivateRoute requiredRole="superadmin">
                    <SuperAdminPanel />
                  </PrivateRoute>
                }
              />

              <Route
                path="/all-transactions"
                element={
                  <PrivateRoute requiredRole="superadmin">
                    <AllTransactions />
                  </PrivateRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<FallbackRoute />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

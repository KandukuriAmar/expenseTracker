import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { useAuth } from "./context/AuthContext.tsx";
import Navbar from "./components/Navbar.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import "./styles/utilities.css";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.tsx";
import SuperAdminPanel from "./pages/SuperAdminPanel.tsx";
import AllTransactions from "./pages/AllTransactions.tsx";

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

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

              <Route path="*" element={<FallbackRoute />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

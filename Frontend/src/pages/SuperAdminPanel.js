import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { UserPlus, Shield, Trash2, Power, Edit3, Key, AlertCircle, CheckCircle } from "lucide-react";
import "../styles/AdminPanel.css";

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const previousDataRef = useRef({});
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedResetRequest, setSelectedResetRequest] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/users/with-balance");
      const newAdmins = res.data?.users || [];
      
      // Only update if data actually changed
      const dataChanged = JSON.stringify(newAdmins) !== JSON.stringify(previousDataRef.current);
      if (dataChanged) {
        previousDataRef.current = newAdmins;
        setAdmins(newAdmins);
      }
    } catch (err) {
      // Silent fail on polling error
    }
  };

  const fetchPasswordResetRequests = async () => {
    try {
      const res = await api.get("/users/password-reset-requests");
      setPasswordResetRequests(res.data?.requests || []);
    } catch (err) {
      console.error("Failed to fetch password reset requests");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchPasswordResetRequests();

    // Real-time polling every 10 seconds (increased from 5s to reduce flickering)
    const intervalId = setInterval(() => {
      fetchAdmins();
      fetchPasswordResetRequests();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user._id || user.id);
      setFormData({ name: user.name, email: user.email, password: "" });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", password: "" });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to completely delete this admin?")
    ) {
      try {
        await api.delete(`/users/${id}`);
        fetchAdmins();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle`);
      fetchAdmins();
    } catch (err) {
      alert("Failed to toggle active status");
    }
  };

  // Helper function to format balance with currency and color
  const formatBalance = (balance) => {
    const formattedAmount = Math.abs(balance).toFixed(2);
    const isNegative = balance < 0;
    return {
      text: `${isNegative ? "-" : "+"}$${formattedAmount}`,
      color: isNegative ? "#dc2626" : "#16a34a",
      isNegative,
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, formData);
      } else {
        await api.post("/users", { ...formData, role: "admin" });
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving user");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setResetMessage("Password must be at least 6 characters long");
      return;
    }

    setResetLoading(true);
    try {
      await api.patch(`/users/password-reset/${selectedResetRequest.id}`, {
        newPassword,
      });
      setResetMessage("Password reset successfully!");
      setNewPassword("");
      
      setTimeout(() => {
        setShowResetModal(false);
        setSelectedResetRequest(null);
        setResetMessage("");
        fetchPasswordResetRequests();
      }, 1500);
    } catch (err) {
      setResetMessage(err.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="admin-header">
        <div className="admin-title-section">
          <Shield size={28} color="var(--gradient-primary)" />
          <h2>SuperAdmin Workspace</h2>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <UserPlus size={18} /> Create Admin
        </button>
      </div>

      <div
        className="glass-panel admin-table-container"
      >
        <h3 className="admin-table-title">
          All Admin Accounts
        </h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Total Balance</th>
                <th>Status</th>
                <th>Created At</th>
                <th className="admin-table-actions-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin) => {
                  const balanceInfo = formatBalance(admin.balance || 0);
                  return (
                    <tr key={admin._id || admin.id}>
                      <td className="table-title-cell">{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>
                        <span
                          style={{
                            color: balanceInfo.color,
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          {balanceInfo.text}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${admin.isActive ? "badge-active" : "badge-inactive"}`}
                        >
                          {admin.isActive ? "Active" : "InActive"}
                        </span>
                      </td>
                      <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td className="admin-table-actions-center">
                        <div className="table-action-row">
                          {admin.role !== "superadmin" && (
                            <>
                              <button
                                className="btn btn-outline admin-button-small"
                                onClick={() =>
                                  handleToggleActive(admin._id || admin.id)
                                }
                                title={admin.isActive ? "Deactivate" : "Activate"}
                              >
                                <Power
                                  size={16}
                                  color={admin.isActive ? "#16a34a" : "#dc2626"}
                                />
                              </button>
                              <button
                                className="btn btn-outline admin-button-small"
                                onClick={() => handleOpenModal(admin)}
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                className="btn btn-outline admin-button-small"
                                style={{
                                  color: "#dc2626",
                                  borderColor: "rgba(239, 68, 68, 0.2)",
                                }}
                                onClick={() =>
                                  handleDelete(admin._id || admin.id)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          {admin.role === "superadmin" && (
                            <span
                              className="text-sm"
                              style={{
                                color: "var(--text-secondary)",
                              }}
                            >
                              System
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center"
                    style={{
                      padding: "2rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Loading admins...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Reset Requests Section */}
      <div className="glass-panel admin-table-container" style={{ marginTop: "2rem" }}>
        <h3 className="admin-table-title">
          <Key size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
          Password Reset Requests
        </h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Admin Email</th>
                <th>Requested At</th>
                <th>Status</th>
                <th className="admin-table-actions-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwordResetRequests && passwordResetRequests.length > 0 ? (
                passwordResetRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.email}</td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          request.status === "pending"
                            ? "badge-inactive"
                            : "badge-active"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </td>
                    <td className="admin-table-actions-center">
                      {request.status === "pending" && (
                        <button
                          className="btn btn-outline admin-button-small"
                          style={{
                            color: "#3b82f6",
                            borderColor: "rgba(59, 130, 246, 0.2)",
                          }}
                          onClick={() => {
                            setSelectedResetRequest(request);
                            setShowResetModal(true);
                            setResetMessage("");
                            setNewPassword("");
                          }}
                        >
                          <Key size={16} /> Reset
                        </button>
                      )}
                      {request.status === "resolved" && (
                        <span
                          style={{
                            color: "#16a34a",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <CheckCircle size={16} /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center"
                    style={{
                      padding: "2rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No password reset requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {editingId ? "Edit Admin" : "New Admin Account"}
              </h3>
              <button
                className="btn btn-outline"
                style={{ padding: "0.25rem 0.5rem", border: "none" }}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Admin User"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@domain.com"
                />
              </div>

              <div className="form-group login-form-group">
                <label className="form-label" htmlFor="password">
                  Password{" "}
                  {editingId && (
                    <span style={{ fontSize: "0.7rem", fontWeight: "normal" }}>
                      (Leave blank to keep unchanged)
                    </span>
                  )}
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={editingId ? "••••••••" : "Strong Password"}
                  minLength="6"
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Save Changes" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && selectedResetRequest && (
        <div className="modal-overlay" onClick={() => {
          setShowResetModal(false);
          setSelectedResetRequest(null);
          setNewPassword("");
          setResetMessage("");
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Reset Password
              </h3>
              <button
                className="btn btn-outline"
                style={{ padding: "0.25rem 0.5rem", border: "none" }}
                onClick={() => {
                  setShowResetModal(false);
                  setSelectedResetRequest(null);
                  setNewPassword("");
                  setResetMessage("");
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="modal-body">
              <div
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  <strong>Admin Email:</strong> {selectedResetRequest.email}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>Requested:</strong>{" "}
                  {new Date(selectedResetRequest.createdAt).toLocaleString()}
                </p>
              </div>

              {resetMessage && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor:
                      resetMessage.includes("successfully") ||
                      resetMessage.includes("Successfully")
                        ? "rgba(22, 163, 74, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                    border:
                      resetMessage.includes("successfully") ||
                      resetMessage.includes("Successfully")
                        ? "1px solid rgba(22, 163, 74, 0.2)"
                        : "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    color:
                      resetMessage.includes("successfully") ||
                      resetMessage.includes("Successfully")
                        ? "#16a34a"
                        : "#dc2626",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {resetMessage.includes("successfully") ||
                  resetMessage.includes("Successfully") ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {resetMessage}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="new-password">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="form-input"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  minLength="6"
                />
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.5rem",
                  }}
                >
                  This new password will be assigned to the admin for their
                  next login.
                </p>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowResetModal(false);
                    setSelectedResetRequest(null);
                    setNewPassword("");
                    setResetMessage("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { UserPlus, Shield, Trash2, Power, Edit3 } from "lucide-react";
import "../styles/AdminPanel.css";

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/users");
      setAdmins(res.data?.users || []);
    } catch (err) {
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
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
                <th>Status</th>
                <th>Created At</th>
                <th className="admin-table-actions-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id || admin.id}>
                    <td className="table-title-cell">{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>
                      <span
                        className={`badge ${admin.isActive ? "badge-active" : "badge-inactive"}`}
                      >
                        {admin.isActive ? "Active" : "Suspended"}
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
                          <span className="text-sm"
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
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
    </div>
  );
};

export default SuperAdminPanel;

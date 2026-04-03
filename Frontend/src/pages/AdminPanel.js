import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { UserPlus, Edit3, Trash2, Power } from "lucide-react";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      // Only show regular admins
      setUsers(res.data.filter((u) => u.role === "admin"));
    } catch (err) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
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
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle`);
      fetchUsers();
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
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving user");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="admin-header">
        <div className="admin-title-section">
          <h2>Admin Workspace</h2>
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
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isActive ? "Active" : "Suspended"}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="admin-table-actions-center">
                    <button
                      className="btn btn-sm admin-button-small"
                      onClick={() => handleOpenModal(user)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="btn btn-sm admin-button-small"
                      onClick={() => handleToggleActive(user.id || user._id)}
                    >
                      <Power size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger admin-button-small"
                      onClick={() => handleDelete(user.id || user._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? "Edit Admin" : "Create Admin"}</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingId}
              />
              <div className="admin-modal-form-actions">
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

import React, { useState, useEffect } from "react";
import api from "../api/axios.ts";
import { UserPlus, Shield, Trash2, Power, Edit3, Eye, EyeOff } from "lucide-react";
import "../styles/AdminPanel.css";

interface Admin {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  isActive: boolean;
  role: string;
  createdAt: string;
  totalIncome?: number;
  totalExpense?: number;
  balance?: number;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SuperAdminPanel = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/users");
      const users = res.data?.users || [];
      
      const adminsWithSummary = await Promise.all(
        users.map(async (user: Admin) => {
          try {
            const txnRes = await api.get(`/transactions?userId=${user._id || user.id}`);
            const transactions = txnRes.data?.transactions || [];
            
            const summary = transactions.reduce(
              (acc: any, txn: any) => {
                if (txn.type?.toLowerCase() === "income") {
                  acc.totalIncome += Number(txn.amount || 0);
                } else {
                  acc.totalExpense += Number(txn.amount || 0);
                }
                return acc;
              },
              { totalIncome: 0, totalExpense: 0 }
            );
            
            return {
              ...user,
              totalIncome: summary.totalIncome,
              totalExpense: summary.totalExpense,
              balance: summary.totalIncome - summary.totalExpense,
            };
          } catch (err) {
            return {
              ...user,
              totalIncome: 0,
              totalExpense: 0,
              balance: 0,
            };
          }
        })
      );
      
      setAdmins(adminsWithSummary);
    } catch (err) {
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenModal = (user: Admin | null = null) => {
    if (user) {
      setEditingId(user._id || user.id || null);
      setFormData({ name: user.name, email: user.email, password: "" });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", password: "" });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to completely delete this admin?")
    ) {
      try {
        await api.delete(`/users/${id}`);
        fetchAdmins();
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/users/${id}/toggle`);
      fetchAdmins();
    } catch (err) {
      alert("Failed to toggle active status");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, formData);
      } else {
        await api.post("/users", { ...formData, role: "admin" });
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err: any) {
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
        style={{ overflowX: "auto", width: "100%", maxWidth: "100%" }}
      >
        <h3 className="admin-table-title">
          All Admin Accounts
        </h3>
        <div className="table-wrapper" style={{ overflowX: "auto", minWidth: "100%" }}>
          <table style={{ width: "1400px", minWidth: "1400px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Balance</th>
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
                        {admin.isActive ? "Active" : "InActive"}
                      </span>
                    </td>
                    <td>₹{(admin.totalIncome || 0).toLocaleString()}</td>
                    <td>₹{(admin.totalExpense || 0).toLocaleString()}</td>
                    <td>₹{(admin.balance || 0).toLocaleString()}</td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td className="admin-table-actions-center">
                      <div className="table-action-row">
                        {admin.role !== "superadmin" && (
                          <>
                            <button
                              className="btn btn-outline admin-button-small"
                              onClick={() =>
                                handleToggleActive(admin._id || admin.id || "")
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
                                handleDelete(admin._id || admin.id || "")
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
                    colSpan={8}
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

              <div className="form-group login-form-group" style={{ position: "relative" }}>
                <label className="form-label" htmlFor="password">
                  Password{" "}
                  {editingId && (
                    <span style={{ fontSize: "0.7rem", fontWeight: "normal" }}>
                      (Leave blank to keep unchanged)
                    </span>
                  )}
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={editingId ? "••••••••" : "Strong Password"}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="var(--text-secondary)" />
                    ) : (
                      <Eye size={18} color="var(--text-secondary)" />
                    )}
                  </button>
                </div>
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

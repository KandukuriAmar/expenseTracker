import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios.ts";
import { Wallet, Search, Edit3, Trash2, Filter } from "lucide-react";
import "../styles/Dashboard.css";

interface Transaction {
  _id?: string;
  id?: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  note?: string;
  userId: string;
  doneByName?: string;
  user?: { name: string };
  User?: { name: string };
  Users?: { name: string };
}

interface Admin {
  id?: string;
  name: string;
  email: string;
}

interface FormData {
  title: string;
  amount: string;
  type: string;
  category: string;
  date: string;
  note: string;
}

const AllTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    amount: "",
    type: "Expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [filter, setFilter] = useState("");

  const applyFilter = useCallback(async () => {
    try {
      let url = "/transactions?";

      if (filter) {
        url += `type=${filter.toLowerCase()}&`;
      }
      if (selectedUserId) {
        url += `userId=${selectedUserId}`;
      }
      const res = await api.get(url);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error applying filter", err);
    }
  }, [filter, selectedUserId]);
  
  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await api.get("/users");
      setAdmins(res.data.users);
    } catch (err) {
      setAdmins([]);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleOpenModal = (txn: Transaction) => {
    setEditingId(txn._id || txn.id || null);
    setFormData({
      title: txn.title || "",
      amount: String(txn.amount) || "",
      type: txn.type || "Expense",
      category: txn.category || "",
      date: txn.date
        ? new Date(txn.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      note: txn.note || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      await api.delete(`/transactions/${id}`);
      applyFilter();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) {
      return;
    }
    try {
      await api.put(`/transactions/${editingId}`, {
        ...formData,
        amount: Number(formData.amount),
      });
      setShowModal(false);
      setEditingId(null);
      applyFilter();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update transaction");
    }
  };

  const filteredTransactions = (
    Array.isArray(transactions) ? transactions : []
  ).filter(
    (t) =>
      (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.category &&
        t.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.doneByName || t.user?.name || t.User?.name || t.Users?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-action-bar mb-2rem">
        <div className="dashboard-action-title">
          <Wallet size={28} color="#6366f1" />
          <h2>Global Transactions Log</h2>
        </div>

        <div className="flex-gap-md">
          <select
            className="form-input"
            style={{ width: "220px", padding: "0.45rem 0.75rem" }}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">All Admins</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name} ({admin.email})
              </option>
            ))}
          </select>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--input-bg)",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Search
              size={16}
              color="var(--text-secondary)"
              style={{ marginRight: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                width: "200px",
              }}
            />
          </div>
          <div className="filter-container">
            <div className="filter-section mt-2rem">
              <Filter size={18} color="var(--text-secondary)" />
              <select
                className="form-input filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div
        className="glass-panel"
        style={{ padding: "1.5rem", overflow: "hidden" }}
      >
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Done By</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t._id || t.id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td className="table-title-cell">{t.title}</td>
                    <td>{t.category}</td>
                    <td>
                      <span
                        className={`badge ${t.type.toLowerCase() === "income" ? "badge-income" : "badge-expense"}`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="table-amount-cell">
                      ₹{t.amount.toLocaleString()}
                    </td>
                    <td className="text-secondary">
                      {t.doneByName ||
                        t.user?.name ||
                        t.User?.name ||
                        t.Users?.name ||
                        `User #${t.userId}`}
                    </td>
                    <td className="text-center">
                      <div className="table-action-row">
                        <button
                          className="btn btn-outline table-action-btn"
                          onClick={() => handleOpenModal(t)}
                          title="Edit transaction"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn btn-outline table-action-btn"
                          style={{
                            color: "#dc2626",
                            borderColor: "rgba(239, 68, 68, 0.2)",
                          }}
                          onClick={() => handleDelete(t._id || t.id || "")}
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center"
                    style={{
                      padding: "2rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No transactions found in the global log.
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                Edit Transaction
              </h3>
              <button
                className="btn btn-outline"
                style={{ padding: "0.25rem 0.5rem", border: "none" }}
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-input"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="form-group login-form-group">
                <label className="form-label">Note</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;

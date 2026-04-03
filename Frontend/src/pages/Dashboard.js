import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  Plus,
  Edit2,
  Trash2,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [filter, setFilter] = useState(""); // '' means All, 'Income' or 'Expense'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "Expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const fetchData = useCallback(async () => {
    try {
      // Fetch summary
      const sumRes = await api.get("/transactions/summary");
      const summaryData = sumRes.data?.summary || sumRes.data || {};
      setSummary({
        income: Number(summaryData.totalIncome || summaryData.income || 0),
        expense: Number(summaryData.totalExpense || summaryData.expense || 0),
        balance: Number(summaryData.balance || 0),
      });

      const endpoint = filter
        ? `/transactions?type=${filter.toLowerCase()}`
        : "/transactions";
      const txnRes = await api.get(endpoint);
      const transactionsData = Array.isArray(txnRes.data)
        ? txnRes.data
        : Array.isArray(txnRes.data?.transactions)
          ? txnRes.data.transactions
          : [];
      setTransactions(transactionsData);
    } catch (err) {
      setSummary({ income: 0, expense: 0, balance: 0 });
      setTransactions([]);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (txn = null) => {
    if (txn) {
      setEditingId(txn._id || txn.id);
      setFormData({
        title: txn.title,
        amount: txn.amount,
        type: txn.type,
        category: txn.category,
        date: new Date(txn.date).toISOString().split("T")[0],
        note: txn.note || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        amount: "",
        type: "Expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchData(); // Refresh summary and list
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: Number(formData.amount) };
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving transaction");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2>Transactions</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="card"
          style={{ background: "var(--gradient-income)", color: "white" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Total Income
            </h3>
            <TrendingUp size={24} color="rgba(255,255,255,0.8)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ₹{summary.income?.toLocaleString() || 0}
          </div>
        </div>

        <div
          className="card"
          style={{ background: "var(--gradient-expense)", color: "white" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Total Expense
            </h3>
            <TrendingDown size={24} color="rgba(255,255,255,0.8)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ₹{summary.expense?.toLocaleString() || 0}
          </div>
        </div>

        <div
          className="card"
          style={{ background: "var(--gradient-balance)", color: "white" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Balance
            </h3>
            <IndianRupee size={24} color="rgba(255,255,255,0.8)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ₹{summary.balance?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div
        className="glass-panel"
        style={{ padding: "1.5rem", overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.25rem" }}>Recent History</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select
              className="form-input"
              style={{ width: "auto", padding: "0.4rem 1rem" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t._id || t.id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: "500" }}>{t.title}</td>
                    <td>{t.category}</td>
                    <td>
                      <span
                        className={`badge ${t.type.toLowerCase() === "income" ? "badge-income" : "badge-expense"}`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      ₹{t.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="btn btn-outline"
                          style={{ padding: "0.35rem 0.5rem" }}
                          onClick={() => handleOpenModal(t)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{
                            padding: "0.35rem 0.5rem",
                            color: "#dc2626",
                            borderColor: "rgba(239, 68, 68, 0.2)",
                          }}
                          onClick={() => handleDelete(t._id || t.id)}
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
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No transactions found. Look at you saving money!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {editingId ? "Edit Transaction" : "New Transaction"}
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
                <label className="form-label" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Salary, Groceries"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="type">
                    Type
                  </label>
                  <select
                    id="type"
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
                  <label className="form-label" htmlFor="amount">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="form-input"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    className="form-input"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Food"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    className="form-input"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label" htmlFor="note">
                  Note (Optional)
                </label>
                <textarea
                  id="note"
                  className="form-input"
                  rows="2"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder="Additional details..."
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Save Changes" : "Create Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

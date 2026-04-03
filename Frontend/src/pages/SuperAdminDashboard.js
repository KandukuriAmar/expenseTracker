import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Users, UserCheck, ReceiptText } from "lucide-react";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, transactionsRes] = await Promise.all([
          api.get("/users"),
          api.get("/transactions?limit=5"),
        ]);

        const users = Array.isArray(usersRes.data)
          ? usersRes.data
          : Array.isArray(usersRes.data?.users)
            ? usersRes.data.users
            : [];

        const allTransactions = Array.isArray(transactionsRes.data)
          ? transactionsRes.data
          : Array.isArray(transactionsRes.data?.transactions)
            ? transactionsRes.data.transactions
            : [];
        const totalCount = Number(transactionsRes.data?.totalCount || 0);

        setAdmins(users);
        setTransactions(allTransactions);
        setTotalTransactionsCount(totalCount);
      } catch (error) {
        setAdmins([]);
        setTransactions([]);
        setTotalTransactionsCount(0);
      }
    };

    fetchData();
  }, []);

  const activeAdminsCount = useMemo(
    () => admins.filter((admin) => admin.isActive).length,
    [admins],
  );

  const recentTransactions = useMemo(() => transactions, [transactions]);

  return (
    <div className="dashboard-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Superadmin Dashboard</h2>
        <Link to="/superadmin" className="btn btn-outline">
          Manage Admins
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="card"
          style={{ background: "var(--gradient-primary)", color: "white" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)" }}>
              Total Admins
            </h3>
            <Users size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {admins.length}
          </div>
        </div>

        <div
          className="card"
          style={{ background: "var(--gradient-income)", color: "white" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)" }}>
              Active Admins
            </h3>
            <UserCheck size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {activeAdminsCount}
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
            }}
          >
            <h3 style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)" }}>
              Total Transactions
            </h3>
            <ReceiptText size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {totalTransactionsCount}
          </div>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{ padding: "1.25rem", overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontSize: "1.1rem" }}>Recent Transactions</h3>
          <Link to="/all-transactions" className="btn btn-outline">
            View All Transactions
          </Link>
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
                <th>Done By</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((txn) => (
                  <tr key={txn.id || txn._id}>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: "600" }}>{txn.title}</td>
                    <td>{txn.category}</td>
                    <td>
                      <span
                        className={`badge ${String(txn.type).toLowerCase() === "income" ? "badge-income" : "badge-expense"}`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td>₹{Number(txn.amount || 0).toLocaleString()}</td>
                    <td>
                      {txn.doneByName ||
                        txn.user?.name ||
                        txn.User?.name ||
                        txn.Users?.name ||
                        `User #${txn.userId}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

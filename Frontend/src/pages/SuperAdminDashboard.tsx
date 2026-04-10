import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.ts";
import { Users, UserCheck, ReceiptText } from "lucide-react";
import "../styles/Dashboard.css";

interface Admin {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface Transaction {
  id?: string;
  _id?: string;
  date: string;
  title: string;
  category: string;
  type: string;
  amount: number;
  userId: string;
  doneByName?: string;
  user?: { name: string };
  User?: { name: string };
  Users?: { name: string };
}

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users").then((res) => res.data.users);
        const allTransactions = await api.get("/transactions").then((res) => res.data.transactions);
        const totalCount = allTransactions.length;

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
      <div className="dashboard-action-bar mb-1-5rem">
        <h2>Superadmin Dashboard</h2>
      </div>

      <div className="grid-auto-fit mb-1-5rem">
        <div
          className="card"
          style={{ background: "var(--gradient-primary)", color: "white" }}
        >
          <div className="summary-card-header">
            <h3 className="summary-card-title">
              Total Admins
            </h3>
            <Users size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div className="summary-card-amount">
            {admins.length}
          </div>
        </div>

        <div
          className="card"
          style={{ background: "var(--gradient-income)", color: "white" }}
        >
          <div className="summary-card-header">
            <h3 className="summary-card-title">
              Active Admins
            </h3>
            <UserCheck size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div className="summary-card-amount">
            {activeAdminsCount}
          </div>
        </div>

        <div
          className="card"
          style={{ background: "var(--gradient-expense)", color: "white" }}
        >
          <div className="summary-card-header">
            <h3 className="summary-card-title">
              Total Transactions
            </h3>
            <ReceiptText size={22} color="rgba(255,255,255,0.9)" />
          </div>
          <div className="summary-card-amount">
            {totalTransactionsCount}
          </div>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{ padding: "1.25rem", overflow: "hidden" }}
      >
        <div className="filter-container mb-1rem">
          <h3 className="text-md">All Admins Transactions</h3>
          <Link to="/all-transactions" className="btn btn-outline"
          style={{ textDecoration: "none" }}>
            Manage Transactions
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
                    <td className="table-title-cell">{txn.title}</td>
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
                    colSpan={6}
                    className="text-center"
                    style={{ padding: "2rem" }}
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

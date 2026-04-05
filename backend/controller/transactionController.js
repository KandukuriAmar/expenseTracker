import Transactions from "../models/Transactions.js";
import { Op } from "sequelize";
import Users from "../models/Admin.js";

const getAllTransactionsorfilterByType = async (req, res) => {
  try {
    const type = req.query.type;
    const useridByQuery = req.query.userId;
    const userId = req.user.id;
    const role = req.user.role;
    console.log("came to get transactions with query: ", type, useridByQuery);
    
    let transactions;

    if (role === "superadmin") {
      if (type && useridByQuery) {
        transactions = await Transactions.findAll({ where: { type, userId: Number(useridByQuery) }, include: [{ model: Users, attributes: ["name"]}]});
      } else if (type) {
        transactions = await Transactions.findAll({ where: { type }, include: [{ model: Users, attributes: ["name"]}]});
      } else if (useridByQuery) {
        transactions = await Transactions.findAll({ where: { userId: Number(useridByQuery) }, include: [{ model: Users, attributes: ["name"]}]});
      } else {
        transactions = await Transactions.findAll({ include: [{ model: Users, attributes: ["name"]}]});
      }
      return res.status(200).json({
        message: "Transactions fetched successfully",
        transactions,
      });
    }

    if (type) {
      transactions = await Transactions.findAll({where: { type, userId }});
    } else {
      transactions = await Transactions.findAll({where: { userId }});
    }

    return res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
        const userId = req.user.id;
        if(req.user.role === "superadmin") {
            const totalIncome = await Transactions.sum('amount', {where: {type: 'income'}});
            const totalExpense = await Transactions.sum('amount', {where: {type: 'expense'}});
            const balance = totalIncome - totalExpense;
            return res.status(200).json({message: "Transaction summary fetched successfully", summary: {totalIncome, totalExpense, balance}});
        }
        const transactions = await Transactions.findAll({where: {userId}});
        if(transactions.length === 0) {
            return res.status(404).json({message: "No transactions found for this user"});
        }
        const totalIncome = await Transactions.sum('amount', {where: {type: 'income', userId}});
        const totalExpense = await Transactions.sum('amount', {where: {type: 'expense', userId}});
        const balance = totalIncome - totalExpense;
        res.status(200).json({message: "Transaction summary fetched successfully", summary: {totalIncome, totalExpense, balance}});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
};

const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, type, category, date, note } = req.body;
    const newTransaction = await Transactions.create({
      userId,
      title,
      amount,
      type,
      category,
      date,
      note,
    });
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { title, amount, type, category, date, note } = req.body;
    const transaction = await Transactions.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (req.user.role !== "superadmin" && transaction.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this transaction" });
    }
    await transaction.update({ title, amount, type, category, date, note });
    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transactions.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (req.user.role !== "superadmin" && transaction.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this transaction" });
    }
    await transaction.destroy();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const getTransactionSummaryById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transactions.findAll({
      where: { id: transactionId },
      where: { type: "income" },
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    const totalincome = await Transactions.sum("amount", {
      where: { id: transactionId },
      where: { type: "income" },
    });
    const totalExpense = await Transactions.sum("amount", {
      where: { id: transactionId },
      where: { type: "expense" },
    });
    const balance = totalincome - totalExpense;
    res.status(200).json({
      message: "Transaction summary fetched successfully",
      summary: { totalincome, totalExpense, balance },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

export {
  getAllTransactionsorfilterByType,
  getTransactionSummaryById,
  getTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

import Transactions from "../models/Transactions.js";
import { Op } from "sequelize";
import Users from "../models/Admin.js";

const getAllTransactionsorfilterByType = async (req, res) => {
  try {
    const type = req.query.type;
    const userIdQuery = req.query.userId;
    const limitQuery = Number(req.query.limit);
    const userId = req.user.id;
    const isSuperadmin = req.user.role === "superadmin";
    const limit =
      Number.isFinite(limitQuery) && limitQuery > 0
        ? Math.min(limitQuery, 100)
        : null;

    const where = isSuperadmin ? {} : { userId };
    if (isSuperadmin && userIdQuery) {
      where.userId = Number(userIdQuery);
    }
    if (type) {
      where.type = type;
    }

    const findOptions = {
      where,
      order: [
        ["date", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    if (isSuperadmin) {
      findOptions.include = [
        {
          model: Users,
          attributes: ["id", "name", "email"],
        },
      ];
    }

    if (limit) {
      findOptions.limit = limit;
    }

    const [transactions, totalCount] = await Promise.all([
      Transactions.findAll(findOptions),
      Transactions.count({ where }),
    ]);

    return res.status(200).json({
      message: type
        ? "Transactions filtered successfully"
        : "Transactions fetched successfully",
      transactions,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const filterByType = async (req, res) => {
  try {
    const type = req.query.type;
    if (req.user.role === "superadmin") {
      const transactions = await Transactions.findAll({ where: { type } });
      return res
        .status(200)
        .json({ message: "Transactions filtered successfully", transactions });
    }
    const transactions = await Transactions.findAll({
      where: { type, userId: req.user.id },
    });
    res
      .status(200)
      .json({ message: "Transactions filtered successfully", transactions });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const isSuperadmin = req.user.role === "superadmin";
    const userIdQuery = req.query.userId;
    const scope = isSuperadmin ? {} : { userId: req.user.id };
    if (isSuperadmin && userIdQuery) {
      scope.userId = Number(userIdQuery);
    }
    const totalIncome = await Transactions.sum("amount", {
      where: { ...scope, type: { [Op.in]: ["income", "Income"] } },
    });
    const totalExpense = await Transactions.sum("amount", {
      where: { ...scope, type: { [Op.in]: ["expense", "Expense"] } },
    });
    const incomeValue = Number(totalIncome || 0);
    const expenseValue = Number(totalExpense || 0);
    const balance = incomeValue - expenseValue;
    res.status(200).json({
      message: "Transaction summary fetched successfully",
      summary: { totalIncome, totalExpense, balance },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
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
  filterByType,
  getTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

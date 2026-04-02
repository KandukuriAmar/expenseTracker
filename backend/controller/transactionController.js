import Transactions from "../models/Transactions.js";

const getAllTransactionsorfilterByType = async (req, res) => {
    try {
        const type = req.query.type;
        const userId = req.user.id;
        if(type) {
            if(req.user.role === "superadmin") {
            const transactions = await Transactions.findAll({where: {type}});
            return res.status(200).json({message: "Transactions filtered successfully", transactions});
            }
            const transactions = await Transactions.findAll({where: {type}, where: {userId: req.user.id}});
            res.status(200).json({message: "Transactions filtered successfully", transactions});
        }
        console.log("userId at getAllTransactions: ", userId);
        if(req.user.role == "superadmin") {
            const transactions = await Transactions.findAll();
            return res.status(200).json({message: "All transactions fetched successfully", transactions});
        }
        const transactions = await Transactions.findAll({where: {userId}});
        res.status(200).json({message: "Transactions fetched successfully", transactions});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}   

const filterByType = async(req, res) => {
    try {
        const type = req.query.type;
        if(req.user.role === "superadmin") {
            const transactions = await Transactions.findAll({where: {type}});
            return res.status(200).json({message: "Transactions filtered successfully", transactions});
        }
        const transactions = await Transactions.findAll({where: {type}, where: {userId: req.user.id}});
        res.status(200).json({message: "Transactions filtered successfully", transactions});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const getTransactionSummary = async(req, res) => {
    try {
        const totalIncome = await Transactions.sum('amount', {where: {type: 'income'}});
        const totalExpense = await Transactions.sum('amount', {where: {type: 'expense'}});
        const balance = totalIncome - totalExpense;
        res.status(200).json({message: "Transaction summary fetched successfully", summary: {totalIncome, totalExpense, balance}});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const createTransaction = async(req, res) => {
    try {
        const userId = req.user.id;
        const {title, amount, type, category, date, note} = req.body;
        const newTransaction = await Transactions.create({userId, title, amount, type, category, date, note});
        res.status(201).json({message: "Transaction created successfully", transaction: newTransaction});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const updateTransaction = async(req, res) => {
    try {
        const transactionId = req.params.id;
        const {title, amount, type, category, date, note} = req.body;
        const transaction = await Transactions.findByPk(transactionId);
        if(!transaction) {
            return res.status(404).json({message: "Transaction not found"});
        }
        await transaction.update({title, amount, type, category, date, note});
        res.status(200).json({message: "Transaction updated successfully", transaction});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const deleteTransaction = async(req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transactions.findByPk(transactionId);
        if(!transaction) {
            return res.status(404).json({message: "Transaction not found"});
        }
        await transaction.destroy();
        res.status(200).json({message: "Transaction deleted successfully"});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const getTransactionSummaryById = async(req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transactions.findAll({where: {id: transactionId}, where: {type: 'income'}});
        if(!transaction) {
            return res.status(404).json({message: "Transaction not found"});
        }
        const totalincome = await Transactions.sum('amount', {where: {id: transactionId}, where: {type: 'income'}});
        const totalExpense = await Transactions.sum('amount', {where: {id: transactionId}, where: {type: 'expense'}});
        const balance = totalincome - totalExpense;
        res.status(200).json({message: "Transaction summary fetched successfully", summary: {totalincome, totalExpense, balance}});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

export {
    getAllTransactionsorfilterByType,
    getTransactionSummaryById,
    filterByType,
    getTransactionSummary,
    createTransaction,
    updateTransaction,
    deleteTransaction
};
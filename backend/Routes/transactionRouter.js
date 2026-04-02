import express from "express";
const router = express.Router();
import * as transactionController from "../controller/transactionController.js";
import auth from "../middlewares/auth.js";

router.get("/", auth, transactionController.getAllTransactionsorfilterByType);
router.get("/summary", auth, transactionController.getTransactionSummary);
router.get("/summary/:id", auth, transactionController.getTransactionSummaryById);
router.post("/", auth, transactionController.createTransaction);
router.put("/:id", auth, transactionController.updateTransaction);
router.delete("/:id", auth, transactionController.deleteTransaction);

export default router;
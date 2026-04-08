import express from "express";
import bodyParser from "body-parser";
import { sequelize, connectDB } from "./db/DBConfig.js";
import dotenv from "dotenv";
import authRouter from "./Routes/authRouter.js";
import userRouter from "./Routes/userRouter.js";
import transactionRouter from "./Routes/transactionRouter.js";
import cookieParser from "cookie-parser";
import corsMiddleware from "./middlewares/cors.js";
import seedSuperAdmin from "./seedSuperAdmin.js";
import PasswordResetRequest from "./models/PasswordResetRequest.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(corsMiddleware);

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    await seedSuperAdmin();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`),
);

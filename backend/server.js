import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {sequelize, connectDB} from './db/DBConfig.js';
import Users from './models/Admin.js';
import Transactions from './models/Transactions.js';
import dotenv from 'dotenv';
import authRouter from './Routes/authRouter.js';
import userRouter from './Routes/userRouter.js';
import transactionRouter from './Routes/transactionRouter.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

(async () => {
  try {
    await connectDB();
    await sequelize.sync({alter: true});
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
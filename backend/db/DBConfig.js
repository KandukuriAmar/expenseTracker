import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.dbName,
  process.env.mysqlUser,
  process.env.mysqlPassword,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

const connectDB = async (req,res) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successfully.');
  } catch (err) {
    console.error('Unable to connect:', err);
    res.status(500).json({message: "Database connection failed: ", err});
  }
};

export { sequelize, connectDB };
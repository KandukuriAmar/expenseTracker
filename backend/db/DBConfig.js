import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
);

const connectDB = async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successfully.");
  } catch (err) {
    console.error("Unable to connect:", err);
    res.status(500).json({ message: "Database connection failed: ", err });
  }
};

export { sequelize, connectDB };

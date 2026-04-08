import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    host: "localhost",
    dialect: "mysql",
  },
);

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successfully.");
  } catch (err) {
    console.error("Unable to connect:", err);
    throw err;
  }
};

export { sequelize, connectDB };

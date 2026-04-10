import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { sequelize } from "./db/DBConfig.js";
import Users from "./models/Admin.js";

export default async function seedSuperAdmin() {
  try {
    await sequelize.sync();

    const email = process.env.seedemail;
    const password = process.env.seedpassword;
    const name = process.env.seedname;
    const role = "superadmin";

    if (!email || !password || !name) {
      throw new Error("Missing required environment variables");
    }

    const existing = await Users.findOne({ where: { email } });

    if (existing) {
      console.log("Superadmin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    console.log("Superadmin seeded successfully.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Seeding failed:", message);
    throw error;
  }
}
 
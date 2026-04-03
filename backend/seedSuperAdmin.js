import bcrypt from "bcrypt";
import { sequelize } from "./db/DBConfig.js";
import Users from "./models/Admin.js";

async function seedSuperAdmin() {
  await sequelize.sync();
  const email = "super93@gmail.com";
  const password = "Super@9393";
  const name = "Super Admin";
  const role = "superadmin";

  // Check if superadmin already exists
  const existing = await Users.findOne({ where: { email } });
  if (existing) {
    console.log("Superadmin already exists.");
    process.exit(0);
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
  process.exit(0);
}

seedSuperAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Admin.js";

const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const isExsitUser = await Users.findOne({ where: { email } });
  if (isExsitUser) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    const isActive = role === "superadmin" ? true : false;
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive,
    });

    const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res
      .status(200)
      .json({ message: "User registered successfully", token, user: newUser });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistUser = await Users.findOne({ where: { email } });
    if (!isExistUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = bcrypt.compareSync(password, isExistUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (!isExistUser.isActive) {
      return res.status(403).json({ message: "Account is not activated yet, pending superadmin approval" });
    }
    const token = jwt.sign(
      { id: isExistUser.id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res
      .status(200)
      .json({
        message: "User logged in successfully",
        token,
        user: isExistUser,
      });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({
        message: "Internal server error",
        error: err.message,
        stack: err.stack,
      });
  }
};

const getCurrentUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const logoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

export {
  loginController,
  registerController,
  getCurrentUserController,
  logoutController,
};
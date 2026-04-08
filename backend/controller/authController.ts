import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import Users from "../models/Admin.js";

const registerController = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
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

    const token = jwt.sign(
      { id: Number(newUser.get("id")), email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
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
const loginController = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;
    const isExistUser = await Users.findOne({ where: { email } });
    if (!isExistUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = bcrypt.compareSync(
      password,
      String(isExistUser.get("password")),
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (!Boolean(isExistUser.get("isActive"))) {
      return res.status(403).json({
        message: "Account is not activated yet, pending superadmin approval",
      });
    }
    const token = jwt.sign(
      { id: Number(isExistUser.get("id")), email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: isExistUser,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("Login error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: message,
      stack,
    });
  }
};

const getCurrentUserController = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err: unknown) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const logoutController = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

export {
  loginController,
  registerController,
  getCurrentUserController,
  logoutController,
};

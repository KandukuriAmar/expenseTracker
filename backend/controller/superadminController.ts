import Users from "../models/Admin.js";
import Transactions from "../models/Transactions.js";
import PasswordResetRequest from "../models/PasswordResetRequest.js";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const users = await Users.findAll({
      where: { role: "admin" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res
      .status(200)
      .json({ message: "Users fetched successfully by superadmin", users });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const getAllUsersWithBalance = async (
  _req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const users = await Users.findAll({
      where: { role: "admin" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    // Add balance information for each user
    const usersWithBalance = await Promise.all(
      users.map(async (user) => {
        const userId = user.get("id");

        // Calculate total income
        const totalIncome = (await Transactions.sum("amount", {
          where: { userId, type: "income" },
        })) || 0;

        // Calculate total expense
        const totalExpense = (await Transactions.sum("amount", {
          where: { userId, type: "expense" },
        })) || 0;

        // Calculate balance
        const balance = totalIncome - totalExpense;

        return {
          ...user.toJSON(),
          totalIncome,
          totalExpense,
          balance,
        };
      }),
    );

    res.status(200).json({
      message: "Users with balance fetched successfully by superadmin",
      users: usersWithBalance,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const addUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const isExsitUser = await Users.findOne({ where: { email } });
    if (isExsitUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await Users.create({
        name,
        email,
        password: hashedPassword,
        role: role || "admin",
      });
      res.status(200).json({
        message: "User added successfully by superadmin",
        user: newUser,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const deleteUserById = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const userId = String(req.params.id);
  try {
    const isExsitUser = await Users.findByPk(userId);
    if (!isExsitUser) {
      return res.status(400).json({ message: "User not found" });
    } else if (String(isExsitUser.get("role")) === "superadmin") {
      return res
        .status(403)
        .json({ message: "Cannot delete superadmin account" });
    } else {
      await Users.destroy({ where: { id: userId } });
      res
        .status(200)
        .json({ message: "User deleted successfully by superadmin" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const deleteUserByEmail = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { email } = req.params;
  try {
    const isExsitUser = await Users.findOne({ where: { email } });
    if (!isExsitUser) {
      return res.status(400).json({ message: "User not found" });
    } else {
      await Users.destroy({ where: { email } });
      res
        .status(200)
        .json({ message: "User deleted successfully by superadmin" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const updateUserById = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const userId = String(req.params.id);
    const { name, email, password, role } = req.body;
    const isExsitUser = await Users.findByPk(userId);
    if (!isExsitUser) {
      return res.status(400).json({ message: "User not found" });
    } else if (String(isExsitUser.get("role")) === "superadmin") {
      return res
        .status(403)
        .json({ message: "Cannot edit superadmin account from this endpoint" });
    } else {
      const updatePayload: Record<string, string> = {};

      if (name) {
        updatePayload.name = name;
      }

      if (email && email !== String(isExsitUser.get("email"))) {
        const emailTaken = await Users.findOne({ where: { email } });
        if (emailTaken && String(emailTaken.get("id")) !== String(userId)) {
          return res.status(400).json({ message: "Email already in use" });
        }
        updatePayload.email = email;
      }

      if (password && password.trim().length > 0) {
        updatePayload.password = bcrypt.hashSync(password, 10);
      }

      if (role) {
        updatePayload.role = role;
      }

      if (Object.keys(updatePayload).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      await Users.update(updatePayload, { where: { id: userId } });
      res
        .status(200)
        .json({ message: "User updated successfully by superadmin" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const toggleUserStatusById = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const userId = String(req.params.id);
    const isExsitUser = await Users.findByPk(userId);
    if (!isExsitUser) {
      return res.status(400).json({ message: "User not found" });
    } else if (String(isExsitUser.get("role")) === "superadmin") {
      return res
        .status(403)
        .json({ message: "Cannot change superadmin status" });
    } else {
      await Users.update(
        {
          isActive: !Boolean(isExsitUser.get("isActive")),
        },
        { where: { id: userId } },
      );
      res
        .status(200)
        .json({ message: "User status toggled successfully by superadmin" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const requestPasswordReset = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = String(user.get("id"));
    const userRole = String(user.get("role"));

    // Only admins can request password reset
    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Only admins can request password resets",
      });
    }

    // Check if there's already a pending request
    const existingRequest = await PasswordResetRequest.findOne({
      where: { userId, status: "pending" },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending password reset request",
      });
    }

    // Create new password reset request
    const resetRequest = await PasswordResetRequest.create({
      userId,
      email,
      status: "pending",
    });

    res.status(201).json({
      message: "Password reset request created successfully",
      request: resetRequest,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const getPasswordResetRequests = async (
  _req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const requests = await PasswordResetRequest.findAll({
      include: [
        {
          model: Users,
          as: "requestedBy",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Password reset requests fetched successfully",
      requests,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};

const resolvePasswordReset = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const requestId = String(req.params.requestId);
    const { newPassword } = req.body;
    const superadminId = req.user?.id;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const resetRequest = await PasswordResetRequest.findByPk(requestId);
    if (!resetRequest) {
      return res.status(404).json({ message: "Reset request not found" });
    }

    if (String(resetRequest.get("status")) !== "pending") {
      return res.status(400).json({ message: "This request is already resolved" });
    }

    const userId = String(resetRequest.get("userId"));
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await Users.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    // Mark request as resolved
    await PasswordResetRequest.update(
      {
        status: "resolved",
        resetBy: superadminId,
        resolvedAt: new Date(),
      },
      { where: { id: requestId } }
    );

    res.status(200).json({
      message: "Password reset successfully",
      newPassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: ", err });
  }
};
export {
  getAllUsers,
  getAllUsersWithBalance,
  addUser,
  deleteUserById,
  deleteUserByEmail,
  updateUserById,
  toggleUserStatusById,
  requestPasswordReset,
  getPasswordResetRequests,
  resolvePasswordReset,
};

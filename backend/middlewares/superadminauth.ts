import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import Users from "../models/Admin.js";

const superadminauthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decodedUser === "string") {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      const payload = decodedUser as JwtPayload & { email?: string };
      if (!payload.email) {
        return res
          .status(401)
          .json({ message: "Token does not include email" });
      }

      const getUser = await Users.findOne({
        where: { email: payload.email },
      });
      console.log("getUser at superadminauthMiddleware: ", getUser);
      if (!getUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (String(getUser.get("role")) !== "superadmin") {
        return res
          .status(403)
          .json({ message: "Access denied: Superadmin only" });
      }
      req.user = {
        id: Number(getUser.get("id")),
        email: String(getUser.get("email")),
        role: String(getUser.get("role")),
      };
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token at superadminauthMiddleware: ",
        error,
      });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export default superadminauthMiddleware;

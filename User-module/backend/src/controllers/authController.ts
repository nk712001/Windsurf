import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { AuditLog } from "../models/AuditLog";

const userRepo = AppDataSource.getRepository(User);
const auditRepo = AppDataSource.getRepository(AuditLog);

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

async function auditLog(action: string, userId: string, actor: string, before: any, after: any, details?: any) {
  await auditRepo.save({ action, userId, actor, before, after, details });
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = userRepo.create({ email, password: hash, firstName, lastName, role: role || "user" });
    await userRepo.save(user);
    // Audit log for registration
    await auditLog(
      "register",
      user.id,
      user.id, // self-registration
      null,
      { ...user, password: undefined },
      { method: "register", ip: req.ip }
    );
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      // Audit log for failed login
      await auditLog(
        "login_failed",
        "unknown",
        "unknown",
        null,
        null,
        { method: "login", email, reason: "user not found", ip: req.ip }
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // Audit log for failed login
      await auditLog(
        "login_failed",
        user.id,
        user.id,
        null,
        null,
        { method: "login", email, reason: "invalid password", ip: req.ip }
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    // Audit log for successful login
    await auditLog(
      "login",
      user.id,
      user.id,
      null,
      null,
      { method: "login", ip: req.ip }
    );
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

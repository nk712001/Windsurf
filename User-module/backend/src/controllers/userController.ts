import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { Like } from "typeorm";

const userRepo = AppDataSource.getRepository(User);

import { AuditLog } from "../models/AuditLog";

async function auditLog(action: string, userId: string, actor: string, before: any, after: any, details?: any) {
  // Persist audit log
  const auditRepo = AppDataSource.getRepository(AuditLog);
  await auditRepo.save({ action, userId, actor, before, after, details });
}

function validateUser(data: any) {
  const errors = [];
  if (!data.firstName || typeof data.firstName !== "string") errors.push("Invalid firstName");
  if (!data.lastName || typeof data.lastName !== "string") errors.push("Invalid lastName");
  if (!data.email || typeof data.email !== "string" || !/^\S+@\S+\.\S+$/.test(data.email)) errors.push("Invalid email");
  if (!data.dateOfBirth || isNaN(Date.parse(data.dateOfBirth))) errors.push("Invalid dateOfBirth");
  if (!data.address || typeof data.address !== "object") errors.push("Invalid address");
  if (!data.department) errors.push("Invalid department");
  if (!data.position) errors.push("Invalid position");
  if (!data.startDate || isNaN(Date.parse(data.startDate))) errors.push("Invalid startDate");
  if (!data.status) errors.push("Invalid status");
  return errors;
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Advanced querying: search, filter, sort, paginate
    const { search, department, status, sortBy = "createdAt", sortOrder = "DESC", page = 1, pageSize = 10 } = req.query;
    const where: any = {};
    if (department) where.department = department;
    if (status) where.status = status;
    if (search) {
      where.firstName = Like(`%${search}%`);
      // Add more fields as needed
    }
    const [users, total] = await userRepo.findAndCount({
      where,
      order: { [sortBy as string]: sortOrder === "ASC" ? "ASC" : "DESC" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      select: ["id", "firstName", "lastName", "email", "phoneNumber", "dateOfBirth", "address", "department", "position", "startDate", "status", "role", "createdAt", "updatedAt"],
    });
    res.json({ total, users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRepo.findOne({
      where: { id: req.params.id },
      select: ["id", "firstName", "lastName", "email", "phoneNumber", "dateOfBirth", "address", "department", "position", "startDate", "status", "role", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (Array.isArray(req.body)) {
      // Bulk create
      const usersToCreate = req.body;
      const allErrors = usersToCreate.map(validateUser);
      // Collect errors for each user
      const hasErrors = allErrors.some(errors => errors.length > 0);
      if (hasErrors) {
        return res.status(400).json({ errors: allErrors });
      }
      // Check for duplicate emails in DB
      const emails = usersToCreate.map(u => u.email);
      const existingUsers = await userRepo.find({ where: emails.map(email => ({ email })) });
      if (existingUsers.length > 0) {
        return res.status(409).json({ message: `Email(s) already registered: ${existingUsers.map(u => u.email).join(', ')}` });
      }
      const users = userRepo.create(usersToCreate);
      const savedUsers = await userRepo.save(users);
      // savedUsers is always an array; auditLog must be called per user, not on the array itself
      savedUsers.forEach(user => auditLog("create", user.id, user));
      return res.status(201).json(savedUsers);
    } else {
      // Single create
      const errors = validateUser(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const exists = await userRepo.findOne({ where: { email: req.body.email } });
      if (exists) return res.status(409).json({ message: "Email already registered" });
      const user = userRepo.create(req.body);
      const savedUser = await userRepo.save(user);
      await auditLog("create", savedUser.id, req.user?.id || 'system', null, savedUser, savedUser);
      return res.status(201).json(savedUser);
    }
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRepo.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const errors = validateUser({ ...user, ...req.body });
    if (errors.length) return res.status(400).json({ errors });
    if (req.body.email && req.body.email !== user.email) {
      const exists = await userRepo.findOne({ where: { email: req.body.email } });
      if (exists) return res.status(409).json({ message: "Email already registered" });
    }
    Object.assign(user, req.body);
    await userRepo.save(user);
    await auditLog("update", user.id, req.user?.id || 'system', { ...user }, { ...user, ...req.body }, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRepo.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    await userRepo.remove(user);
    await auditLog("delete", user.id, req.user?.id || 'system', user, null);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

export const bulkDeleteUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids, confirm } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: "No user IDs provided" });
    if (!confirm) return res.status(400).json({ message: "Confirmation required for bulk delete" });
    const users = await userRepo.findByIds(ids);
    if (users.length === 0) return res.status(404).json({ message: "No users found" });
    await userRepo.remove(users);
    for (const user of users) {
      await auditLog("bulk-delete", user.id, req.user?.id || 'system', user, null);
    }
    res.json({ message: `Deleted ${users.length} users` });
  } catch (err) {
    next(err);
  }
};

export const bulkUpdateUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { updates } = req.body; // [{ id, ...fields }]
    if (!Array.isArray(updates) || updates.length === 0) return res.status(400).json({ message: "No updates provided" });
    const results = [];
    for (const update of updates) {
      const user = await userRepo.findOne({ where: { id: update.id } });
      if (!user) {
        results.push({ id: update.id, status: "not found" });
        continue;
      }
      const errors = validateUser({ ...user, ...update });
      if (errors.length) {
        results.push({ id: update.id, status: "validation failed", errors });
        continue;
      }
      Object.assign(user, update);
      await userRepo.save(user);
      await auditLog("bulk-update", user.id, req.user?.id || 'system', { ...user }, { ...user, ...update }, update);
      results.push({ id: user.id, status: "updated" });
    }
    res.json({ results });
  } catch (err) {
    next(err);
  }
};

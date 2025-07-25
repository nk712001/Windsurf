import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, bulkDeleteUsers, bulkUpdateUsers } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Bulk actions
router.post("/bulk-delete", bulkDeleteUsers);
router.put("/bulk-update", bulkUpdateUsers);

export { router as userRouter };

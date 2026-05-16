import { Router } from "express";

import {
  registerUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser);

router.get("/", getUsers);

router.get("/:id", getUserById);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
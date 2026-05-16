import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  registerUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser);

router.get("/",  getUsers);

router.get("/:id", getUserById);

router.patch("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, deleteUser);
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Crear usuario
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: Usuario creado
 */
/**
 * @swagger
 * responses:
 *   400:
 *     description: Error de validación
 */
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualizar usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
export default router;
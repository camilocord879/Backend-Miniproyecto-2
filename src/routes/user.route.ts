import { Router } from "express";
import { verifyFirebaseToken } from "../auth/auth.middleware";
import {
  getProfile,
  updateMyProfile,
  deleteMyAccount,
  getUsers,
} from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/me", verifyFirebaseToken, getProfile);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Actualizar perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *               lastNames:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Username ya existe
 */
router.patch("/me", verifyFirebaseToken, updateMyProfile);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Eliminar cuenta del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       401:
 *         description: No autorizado
 */
router.delete("/me", verifyFirebaseToken, deleteMyAccount);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error interno
 */
router.get("/", getUsers);

export default router;
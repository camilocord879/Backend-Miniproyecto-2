import { Router } from "express";

import {
  login,
  register,
  me,
  googleAuth,
  completeGoogleAuth,
  updateProfile,
  deleteAccount,
  checkEmail,
  checkUsername,
} from "./auth.controller";

import { verifyFirebaseToken } from "./auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 uid:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: Email o username ya existen
 *       500:
 *         description: Error interno
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 uid:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Errores de validación
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login con Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID Token
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Errores de validación
 *       500:
 *         description: Error interno
 */
router.post("/google", googleAuth);

/**
 * @swagger
 * /api/auth/google/complete:
 *   post:
 *     summary: Completar perfil de Google
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil completado exitosamente
 *       400:
 *         description: Username ya existe
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.post(
  "/google/complete",
  verifyFirebaseToken,
  completeGoogleAuth
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.get(
  "/me",
  verifyFirebaseToken,
  me
);

/**
 * @swagger
 * /api/auth/me:
 *   patch:
 *     summary: Actualizar perfil del usuario
 *     tags: [Auth]
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
 *       500:
 *         description: Error interno
 */
router.patch(
  "/me",
  verifyFirebaseToken,
  updateProfile
);

/**
 * @swagger
 * /api/auth/me:
 *   delete:
 *     summary: Eliminar cuenta del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.delete(
  "/me",
  verifyFirebaseToken,
  deleteAccount
);

/**
 * @swagger
 * /api/auth/check-email:
 *   get:
 *     summary: Verificar disponibilidad de email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email to check
 *     responses:
 *       200:
 *         description: Email availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *       400:
 *         description: Email is required
 *       500:
 *         description: Error interno
 */
router.get("/check-email", checkEmail);

/**
 * @swagger
 * /api/auth/check-username:
 *   get:
 *     summary: Verificar disponibilidad de username
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username to check
 *     responses:
 *       200:
 *         description: Username availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *       400:
 *         description: Username is required
 *       500:
 *         description: Error interno
 */
router.get("/check-username", checkUsername);

export default router;
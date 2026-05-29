import { Router } from "express";
import * as roomController from "../controllers/room.controller";
import { verifyFirebaseToken } from "../auth/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Rooms management endpoints
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend Study Room
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyFirebaseToken,
  roomController.createRoom
);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all user rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  verifyFirebaseToken,
  roomController.getRooms
);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *       404:
 *         description: Room not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  verifyFirebaseToken,
  roomController.getRoomById
);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Room
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  verifyFirebaseToken,
  roomController.updateRoom
);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  verifyFirebaseToken,
  roomController.deleteRoom
);
/**
 * @swagger
 * /api/rooms/{id}/join:
 *   post:
 *     summary: Join a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Joined room successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
router.post(
  "/:id/join",
  verifyFirebaseToken,
  roomController.joinRoom
);
/**
 * @swagger
 * /api/rooms/{id}/leave:
 *   post:
 *     summary: Leave a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Left room successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
router.post(
  "/:id/leave",
  verifyFirebaseToken,
  roomController.leaveRoom
);

export default router;
import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { verifyFirebaseToken } from "../auth/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - content
 *             properties:
 *               roomId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyFirebaseToken,
  messageController.createMessage
);
/**
 * @swagger
 * /api/rooms/{id}/messages:
 *   get:
 *     summary: Get room messages
 *     tags: [Messages]
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
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/rooms/:id/messages",
  verifyFirebaseToken,
  messageController.getRoomMessages
);
export default router;
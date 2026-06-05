import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import * as messageService from "../services/message.service";

export const createMessage = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { roomId, content } = req.body;

    const senderId = req.user?.uid;

    if (!senderId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    if (!content || content.trim().length < 1) {
      return res.status(400).json({
        error: "Message content required"
      });
    }

    const message =
      await messageService.createMessage(
        roomId,
        senderId,
        content.trim()
      );

    return res.status(201).json(message);

  } catch (error: unknown) {

    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: "Internal server error"
    });

  }

};
export const getRoomMessages = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const roomId = String(req.params.id);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || 30, 1),
      100
    );

    const before = (req.query.before as string) || undefined;

    console.log("GET MESSAGES:", { roomId, limit, before });

    const messages =
      await messageService.getRoomMessages(
        roomId,
        limit,
        before
      );

    console.log("MESSAGES FOUND:", messages.length);

    return res.status(200).json(
      messages
    );

  } catch (error: unknown) {

    console.error("GET MESSAGES ERROR:", error);

    if (error instanceof Error) {

      return res.status(500).json({
        error: error.message
      });

    }

    return res.status(500).json({
      error: "Internal server error"
    });

  }

};

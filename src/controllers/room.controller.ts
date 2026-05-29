import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import * as roomService from "../services/room.service";
import { Room } from "../models/room.model";


export const createRoom = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { name } = req.body;

    const ownerId = req.user?.uid;

    if (!ownerId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        error: "Room name must be at least 3 characters"
      });
    }

    const room = await roomService.createRoom(
      name.trim(),
      ownerId
    );

    return res.status(201).json(room);

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

export const getRooms = async (
  req: AuthRequest,
  res: Response
) => {
  console.log("GET ROOMS ENTER");
  try {

    const userId = req.uid ?? req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const rooms: Room[] = await roomService.getRooms(userId);

    return res.status(200).json(rooms);

  } catch (error: unknown) {

    console.error("GET ROOMS ERROR:", error);

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

export const getRoomById = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const id = String(req.params.id);

    const room: Room | null =
      await roomService.getRoomById(id);

    if (!room) {
      return res.status(404).json({
        error: "Room not found"
      });
    }

    return res.status(200).json(room);

  } catch (error: unknown) {
    console.error("GET ROOM BY ID ERROR:", error);
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

export const updateRoom = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const id = String(req.params.id);

    const { name } = req.body;

    const userId = req.uid ?? req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        error: "Room name must be at least 3 characters"
      });
    }

    const room: Room | null =
      await roomService.getRoomById(id);

    if (!room) {
      return res.status(404).json({
        error: "Room not found"
      });
    }

    if (room.ownerId !== userId) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    const updatedRoom = await roomService.updateRoom(
      id,
      name.trim()
    );

    return res.status(200).json(updatedRoom);

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

export const deleteRoom = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const id = String(req.params.id);

    const userId = req.uid ?? req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const room: Room | null =
      await roomService.getRoomById(id);

    if (!room) {
      return res.status(404).json({
        error: "Room not found"
      });
    }

    if (room.ownerId !== userId) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    await roomService.deleteRoom(id);

    return res.status(200).json({
      message: "Room deleted successfully"
    });

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
export const joinRoom = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const roomId = String(req.params.id);

    const userId = req.uid ?? req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const updatedRoom =
      await roomService.joinRoom(roomId, userId);

    return res.status(200).json(updatedRoom);

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
export const leaveRoom = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const roomId = String(req.params.id);

    const userId = req.uid ?? req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const updatedRoom =
      await roomService.leaveRoom(
        roomId,
        userId
      );

    return res.status(200).json(updatedRoom);

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

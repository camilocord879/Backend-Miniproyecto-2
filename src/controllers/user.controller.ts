import { Request, Response } from "express";
import {
  getUserProfile,
  updateProfile,
  deleteUserAccount,
  getAllUsers,
} from "../services/user.service";

/**
 * GET /users/me
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.user.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await getUserProfile(uid);

    return res.status(200).json({
      user,
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * PATCH /users/me
 * Actualizar perfil del usuario
 */
export const updateMyProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.user.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const updates = req.body;

    const updatedUser = await updateProfile(uid, updates);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(
    "DELETE ACCOUNT ERROR:",
    error
  );


    if (error.message === "CANNOT_UPDATE_EMAIL") {
      return res.status(400).json({
        error: "Cannot update email",
      });
    }

    if (error.message === "CANNOT_UPDATE_PROVIDER") {
      return res.status(400).json({
        error: "Cannot update provider",
      });
    }

    if (error.message === "CANNOT_UPDATE_UID") {
      return res.status(400).json({
        error: "Cannot update UID",
      });
    }

    if (error.message === "CANNOT_UPDATE_CREATED_AT") {
      return res.status(400).json({
        error: "Cannot update created date",
      });
    }

    if (error.message === "USERNAME_ALREADY_EXISTS") {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * DELETE /users/me
 * Eliminar cuenta del usuario
 */
export const deleteMyAccount = async (
  req: Request,
  res: Response
) => {
  try {
    const uid = req.user.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    await deleteUserAccount(uid);

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * GET /users
 * Obtener todos los usuarios
 */
export const getUsers = async (
  _req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      users,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

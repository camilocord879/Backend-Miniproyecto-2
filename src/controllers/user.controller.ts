import { Request, Response } from "express";
import { createUser as createUserService } from "../services/user.service";
import { db } from "../config/firebase";
import { getAllUsers } from "../services/user.service";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo usuarios",
      error,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      message: "Usuario creado",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      message: "Usuario creado",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const doc = await db.collection("users").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ...doc.data(),
      firestoreId: doc.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo usuario",
      error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const docRef = db.collection("users").doc(id);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    await docRef.delete();

    res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando usuario",
      error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const docRef = db.collection("users").doc(id);

    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    await docRef.update(req.body);

    const updatedDoc = await docRef.get();

    res.status(200).json({
      message: "Usuario actualizado",
      user: {
        ...updatedDoc.data(),
        firestoreId: updatedDoc.id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando usuario",
      error,
    });
  }
};
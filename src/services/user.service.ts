import { updateUserProfile, deleteUser, getUserByUID } from "../auth/auth.services";
import { db } from "../config/firebase";
import { User } from "../models/user.model";

/**
 * Obtener perfil del usuario
 */
export const getUserProfile = async (uid: string) => {
  return await getUserByUID(uid);
};

/**
 * Actualizar perfil del usuario
 */
export const updateProfile = async (
  uid: string,
  updates: Partial<User>
) => {
  // Validaciones
  if (updates.email) {
    throw new Error("CANNOT_UPDATE_EMAIL");
  }

  if (updates.provider) {
    throw new Error("CANNOT_UPDATE_PROVIDER");
  }

  if (updates.uid) {
    throw new Error("CANNOT_UPDATE_UID");
  }

  if (updates.createdAt) {
    throw new Error("CANNOT_UPDATE_CREATED_AT");
  }

  return await updateUserProfile(uid, updates);
};

/**
 * Eliminar cuenta del usuario
 */
export const deleteAccount = async (uid: string) => {
  return await deleteUser(uid);
};

/**
 * Obtener todos los usuarios (solo admin)
 */
export const getAllUsers = async () => {
  const snapshot = await db.collection("users").get();
  const users: User[] = [];
  snapshot.forEach((doc) => {
    users.push(doc.data() as User);
  });
  return users;
};

/**
 * Buscar usuario por username
 */
export const getUserByUsername = async (username: string) => {
  const query = await db
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  if (query.empty) {
    throw new Error("USER_NOT_FOUND");
  }

  return query.docs[0].data() as User;
};

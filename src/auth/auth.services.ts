import admin from "firebase-admin";
import { db } from "../config/firebase";
import { RegisterDTO } from "./auth.dto";
import { User } from "../models/user.model";

/**
 * =========================================
 * Registrar usuario manualmente
 * =========================================
 */
export const registerUser = async (
  data: RegisterDTO
) => {

  const {
    names,
    lastNames,
    username,
    avatar,
    email,
    password,
  } = data;

  /**
   * Validar username único
   */
  const usernameQuery = await db
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  if (!usernameQuery.empty) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }

  /**
   * Crear usuario en Firebase Auth
   */
  let userRecord;

  try {

    userRecord = await admin.auth().createUser({
      email,
      password,
    });

  } catch (error: any) {

    if (error.code === "auth/email-already-exists") {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    throw error;
  }

  /**
   * Crear perfil Firestore
   */
  const userProfile: User = {
    uid: userRecord.uid,
    names,
    lastNames,
    username: username.toLowerCase(),
    email,
    avatar,
    provider: "manual",
    createdAt: new Date(),
  };

  /**
   * Guardar perfil
   */
  await db
    .collection("users")
    .doc(userRecord.uid)
    .set(userProfile);

  return {
    uid: userRecord.uid,
    message: "User created successfully",
  };
};

/**
 * =========================================
 * Login manual
 * =========================================
 */
export const loginUser = async (
  email: string,
  password: string
) => {

  /**
   * Buscar usuario por email
   */
  const userQuery = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userQuery.empty) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const userDoc = userQuery.docs[0];

  const user = userDoc.data() as User;

  /**
   * IMPORTANTE:
   * Firebase Auth debería validar password
   * desde frontend/client SDK.
   * Esto es simplificado para Sprint 1.
   */

  const customToken = await admin
    .auth()
    .createCustomToken(user.uid);

  return {
    token: customToken,

    uid: user.uid,

    user: {
      uid: user.uid,
      names: user.names,
      lastNames: user.lastNames,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

/**
 * =========================================
 * Verificar Firebase ID Token
 * =========================================
 */
export const verifyFirebaseToken = async (
  idToken: string
) => {

  try {

    const decodedToken = await admin
      .auth()
      .verifyIdToken(idToken);

    return decodedToken;

  } catch (error) {

    throw new Error("INVALID_TOKEN");
  }
};

/**
 * =========================================
 * Login con Google
 * =========================================
 */
export const googleLogin = async (
  uid: string,
  email: string
) => {

  /**
   * Revisar si ya existe perfil
   */
  const userDoc = await db
    .collection("users")
    .doc(uid)
    .get();

  /**
   * Usuario ya existe
   */
  if (userDoc.exists) {

    const user = userDoc.data() as User;

    return {
      needsUsername: false,

      uid: user.uid,

      user: {
        uid: user.uid,
        names: user.names,
        lastNames: user.lastNames,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  /**
   * Usuario nuevo
   */
  return {
    needsUsername: true,
    uid,
    email,
  };
};

/**
 * =========================================
 * Completar perfil Google
 * =========================================
 */
export const completeGoogleProfile = async (
  uid: string,
  username: string,
  email: string
) => {

  /**
   * Validar username único
   */
  const usernameQuery = await db
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  if (!usernameQuery.empty) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }

  /**
   * Obtener usuario Firebase
   */
  const userRecord = await admin
    .auth()
    .getUser(uid);

  /**
   * Crear perfil
   */
  const userProfile: User = {
    uid,

    names:
      userRecord.displayName?.split(" ")[0] || "",

    lastNames:
      userRecord.displayName
        ?.split(" ")
        .slice(1)
        .join(" ") || "",

    username: username.toLowerCase(),

    email,

    avatar: userRecord.photoURL || "",

    provider: "google",

    createdAt: new Date(),
  };

  /**
   * Guardar perfil
   */
  await db
    .collection("users")
    .doc(uid)
    .set(userProfile);

  return {
    uid,
    message: "Profile completed successfully",
    user: userProfile,
  };
};

/**
 * =========================================
 * Obtener usuario por UID
 * =========================================
 */
export const getUserByUID = async (
  uid: string
) => {

  const userDoc = await db
    .collection("users")
    .doc(uid)
    .get();

  if (!userDoc.exists) {
    throw new Error("USER_NOT_FOUND");
  }

  return userDoc.data() as User;
};

/**
 * =========================================
 * Actualizar perfil
 * =========================================
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<User>
) => {

  /**
   * Validar username único
   */
  if (updates.username) {

    const usernameQuery = await db
      .collection("users")
      .where(
        "username",
        "==",
        updates.username.toLowerCase()
      )
      .get();

    if (!usernameQuery.empty) {

      const existingDoc = usernameQuery.docs[0];

      /**
       * Permitir mismo usuario
       */
      if (existingDoc.id !== uid) {
        throw new Error("USERNAME_ALREADY_EXISTS");
      }
    }

    updates.username =
      updates.username.toLowerCase();
  }

  /**
   * Actualizar usuario
   */
  await db
    .collection("users")
    .doc(uid)
    .update({
      ...updates,
      updatedAt: new Date(),
    });

  return await getUserByUID(uid);
};

/**
 * =========================================
 * Eliminar usuario
 * =========================================
 */
export const deleteUser = async (
  uid: string
) => {

  /**
   * Eliminar Firestore
   */
  await db
    .collection("users")
    .doc(uid)
    .delete();

  /**
   * Eliminar Firebase Auth
   */
  await admin
    .auth()
    .deleteUser(uid);

  return {
    message: "User deleted successfully",
  };
};
import { randomUUID } from "crypto";
import admin from "firebase-admin";
import axios from "axios";

import { db } from "../config/firebase";
import { RegisterDTO } from "./auth.dto";
import { User } from "../models/user.model";
import { isInstitutionalEmail } from "../utils/isInstitutionalEmail";

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

  console.log(
    "📝 Attempting to register user:",
    { email, username }
  );

}
  /**
   * Validar username único
   */
  const usernameQuery = await db
    .collection("users")
    .where(
      "username",
      "==",
      username.toLowerCase()
    )
    .get();

  if (!usernameQuery.empty) {

    console.error(
      "❌ Username already exists:",
      username
    );

    throw new Error(
      "USERNAME_ALREADY_EXISTS"
    );

  }

  /**
   * Crear usuario Firebase Auth
   */
  let userRecord;

  try {

    userRecord = await admin
      .auth()
      .createUser({
        email,
        password,
      });

    console.log(
      "✅ User created in Firebase Auth:",
      userRecord.uid
    );

  } catch (error: any) {

    if (
      error.code ===
      "auth/email-already-exists"
    ) {

      console.error(
        "❌ Email already exists:",
        email
      );

      throw new Error(
        "EMAIL_ALREADY_EXISTS"
      );

    }

    console.error(
      "❌ Firebase Auth error:",
      error.message
    );

    throw error;

  }

  /**
   * Perfil Firestore
   */
  const userProfile: User = {

    uid: userRecord.uid,

    firestoreId: randomUUID(),

    names,

    lastNames,

    username:
      username.toLowerCase(),

    email,

    avatar,

    provider: "manual",

    createdAt: new Date(),

  };

  /**
   * Guardar perfil
   */
  try {

    await db
      .collection("users")
      .doc(userRecord.uid)
      .set(userProfile);

    console.log(
      "✅ User profile saved:",
      userRecord.uid
    );

  } catch (error: any) {

    console.error(
      "❌ Error saving profile:",
      error.message
    );

    throw new Error(
      "ERROR_SAVING_PROFILE"
    );

  }

  /**
   * Login automático
   * Obtener ID TOKEN REAL
   */
  const loginResponse =
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

  const authData =
    loginResponse.data;

  return {

    token:
      authData.idToken,

    refreshToken:
      authData.refreshToken,

    uid: userRecord.uid,

    user: {
      uid: userRecord.uid,
      names: userProfile.names,
      lastNames:
        userProfile.lastNames,
      username:
        userProfile.username,
      email:
        userProfile.email,
      avatar:
        userProfile.avatar,
    },

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

  try {

    const response =
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

    const data =
      response.data;

    const user =
      await getUserByUID(
        data.localId
      );

    return {

      token:
        data.idToken,

      refreshToken:
        data.refreshToken,

      uid:
        data.localId,

      user,

    };

  } catch (error: any) {

    console.error(
      error.response?.data
    );

    throw new Error(
      "INVALID_CREDENTIALS"
    );

  }

};

/**
 * =========================================
 * Verificar Firebase ID Token
 * =========================================
 */
export const verifyFirebaseToken =
  async (
    idToken: string
  ) => {

    try {

      const decodedToken =
        await admin
          .auth()
          .verifyIdToken(
            idToken
          );

      return decodedToken;

    } catch (error) {

      throw new Error(
        "INVALID_TOKEN"
      );

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
  * Validar correo institucional
  */
  if (!isInstitutionalEmail(email)) {

    throw new Error("INVALID_INSTITUTIONAL_EMAIL");

  const userDoc = await db
    .collection("users")
    .doc(uid)
    .get();

  /**
   * Usuario ya existe
   */
  if (userDoc.exists) {

    const user =
      userDoc.data() as User;

    return {

      needsUsername: false,

      uid: user.uid,

      user: {
        uid: user.uid,
        names: user.names,
        lastNames:
          user.lastNames,
        username:
          user.username,
        email:
          user.email,
        avatar:
          user.avatar,
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
export const completeGoogleProfile =
  async (
    uid: string,
    username: string,
    email: string
  ) => {

    /**
     * Validar username único
     */
    const usernameQuery =
      await db
        .collection("users")
        .where(
          "username",
          "==",
          username.toLowerCase()
        )
        .get();

    if (!usernameQuery.empty) {

      throw new Error(
        "USERNAME_ALREADY_EXISTS"
      );

    }

    /**
     * Obtener usuario Firebase
     */
    const userRecord =
      await admin
        .auth()
        .getUser(uid);

    /**
     * Crear perfil
     */
    const userProfile: User = {

      uid,

      firestoreId:
        randomUUID(),

      names:
        userRecord.displayName
          ?.split(" ")[0] || "",

      lastNames:
        userRecord.displayName
          ?.split(" ")
          .slice(1)
          .join(" ") || "",

      username:
        username.toLowerCase(),

      email,

      avatar:
        userRecord.photoURL || "",

      provider: "google",

      createdAt:
        new Date(),

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

      message:
        "Profile completed successfully",

      user: userProfile,

    };

  };

/**
 * =========================================
 * Obtener usuario por UID
 * =========================================
 */
export const getUserByUID =
  async (
    uid: string
  ) => {

    const userDoc =
      await db
        .collection("users")
        .doc(uid)
        .get();

    if (!userDoc.exists) {

      throw new Error(
        "USER_NOT_FOUND"
      );

    }

    return userDoc.data() as User;

  };

/**
 * =========================================
 * Actualizar perfil
 * =========================================
 */
export const updateUserProfile =
  async (
    uid: string,
    updates: Partial<User>
  ) => {

    /**
     * Validar username único
     */
    if (updates.username) {

      const usernameQuery =
        await db
          .collection("users")
          .where(
            "username",
            "==",
            updates.username.toLowerCase()
          )
          .get();

      if (!usernameQuery.empty) {

        const existingDoc =
          usernameQuery.docs[0];

        if (
          existingDoc.id !== uid
        ) {

          throw new Error(
            "USERNAME_ALREADY_EXISTS"
          );

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
        updatedAt:
          new Date(),
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
    message:
      "User deleted successfully",
  };

};

/**
 * =========================================
 * Verificar disponibilidad email
 * =========================================
 */
export const checkEmailAvailability =
  async (
    email: string
  ): Promise<{
    available: boolean;
  }> => {

    const userQuery =
      await db
        .collection("users")
        .where(
          "email",
          "==",
          email
        )
        .get();

    return {
      available:
        userQuery.empty,
    };

  };

/**
 * =========================================
 * Verificar disponibilidad username
 * =========================================
 */
export const checkUsernameAvailability =
  async (
    username: string
  ): Promise<{
    available: boolean;
  }> => {

    const usernameQuery =
      await db
        .collection("users")
        .where(
          "username",
          "==",
          username.toLowerCase()
        )
        .get();

    return {
      available:
        usernameQuery.empty,
    };

  };

import { Request, Response } from "express";
import { ZodError } from "zod";

import {
  registerUser,
  loginUser,
  googleLogin,
  completeGoogleProfile,
  getUserByUID,
  verifyFirebaseToken as verifyFirebaseTokenService,
  updateUserProfile,
  deleteUser,
  checkEmailAvailability,
  checkUsernameAvailability,
} from "./auth.services";

import {
  registerSchema,
  loginSchema,
  completeGoogleProfileSchema,
  googleAuthSchema,
  updateProfileSchema,
} from "./schemas";

import { AuthRequest } from "./auth.middleware";

/**
 * REGISTER
 */
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const data = registerSchema.parse(req.body);

    const result = await registerUser(data);

    return res.status(201).json({
      message: "User created successfully",
      token: result.token,
      uid: result.uid,
      user: result.user,
    });

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    if (error.message === "USERNAME_ALREADY_EXISTS") {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * LOGIN
 */
export const login = async (
  req: Request,
  res: Response
) => {
  try {

    const data = loginSchema.parse(req.body);

    const result = await loginUser(
      data.email,
      data.password
    );

    return res.status(200).json(result);

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * GOOGLE AUTH
 */
export const googleAuth = async (
  req: Request,
  res: Response
) => {
  try {

    const data = googleAuthSchema.parse(req.body);

    const decodedToken =
      await verifyFirebaseTokenService(data.idToken);

    const result = await googleLogin(
      decodedToken.uid,
      decodedToken.email || ""
    );

    return res.status(200).json(result);

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    if (error.message === "INVALID_TOKEN") {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * COMPLETE GOOGLE PROFILE
 */
export const completeGoogleAuth = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const data =
      completeGoogleProfileSchema.parse(req.body);

    const uid = req.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await getUserByUID(uid);

    const result = await completeGoogleProfile(
      uid,
      data.username,
      user.email
    );

    return res.status(200).json(result);

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
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
 * GET ME
 */
export const me = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const uid = req.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await getUserByUID(uid);

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
 * UPDATE PROFILE
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const uid = req.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const data =
      updateProfileSchema.parse(req.body);

    const updatedUser =
      await updateUserProfile(uid, data);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error: any) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
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
 * DELETE ACCOUNT
 */
export const deleteAccount = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const uid = req.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    await deleteUser(uid);

    return res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error: any) {

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * CHECK EMAIL AVAILABILITY
 */
export const checkEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const result = await checkEmailAvailability(email);

    return res.status(200).json(result);

  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * CHECK USERNAME AVAILABILITY
 */
export const checkUsername = async (
  req: Request,
  res: Response
) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        error: "Username is required",
      });
    }

    const result = await checkUsernameAvailability(username);

    return res.status(200).json(result);

  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
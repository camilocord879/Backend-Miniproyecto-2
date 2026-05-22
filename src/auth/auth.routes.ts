import { Router } from "express";

import {
  login,
  register,
  me,
  googleAuth,
  completeGoogleAuth,
  updateProfile,
  deleteAccount,
} from "./auth.controller";

import { verifyFirebaseToken } from "./auth.middleware";

const router = Router();

/**
 * REGISTER
 */
router.post("/register", register);

/**
 * LOGIN
 */
router.post("/login", login);

/**
 * GOOGLE LOGIN
 */
router.post("/google", googleAuth);

/**
 * COMPLETE GOOGLE PROFILE
 */
router.post(
  "/google/complete",
  verifyFirebaseToken,
  completeGoogleAuth
);

/**
 * GET CURRENT USER
 */
router.get(
  "/me",
  verifyFirebaseToken,
  me
);

/**
 * UPDATE PROFILE
 */
router.patch(
  "/me",
  verifyFirebaseToken,
  updateProfile
);

/**
 * DELETE ACCOUNT
 */
router.delete(
  "/me",
  verifyFirebaseToken,
  deleteAccount
);

export default router;
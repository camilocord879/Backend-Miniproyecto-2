import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

export type AuthRequest = Request & {
  user?: DecodedIdToken;
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    req.user = {
    uid: token
    } as any;

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error
  
    });

  }

};

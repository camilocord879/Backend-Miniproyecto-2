import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      user: DecodedIdToken;
      uid?: string;
    }
  }
}

export interface AuthRequest extends Request {
  user: DecodedIdToken;
  uid?: string;
}

/**
 * Middleware para verificar Firebase ID Token
 * Extrae el token del header Authorization: Bearer <token>
 * IMPORTANTE: Debe ser un ID Token (generado por getIdToken()),
 * NO un custom token (createCustomToken)
 */
export const verifyFirebaseToken = async (
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

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // Verificar como ID Token de Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    console.log("✅ ID Token verificado:", {
      uid: decodedToken.uid,
      email: decodedToken.email,
    });

    req.user = decodedToken;
    req.uid = decodedToken.uid;

    next();
  } catch (error: any) {
    console.error("❌ Token inválido:", error.message);
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
      error: error.message,
    });
  }
};

/**
 * Middleware anterior (mantenido para compatibilidad)
 */
export const verifyJWT = async (
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

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      try {
        const decoded = admin.auth().verifySessionCookie(token);
        decodedToken = decoded;
      } catch (innerError) {
        const parts = token.split('.');
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            decodedToken = payload;
          } catch (parseError) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    req.user = decodedToken;
    req.uid = decodedToken.uid || decodedToken.sub;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
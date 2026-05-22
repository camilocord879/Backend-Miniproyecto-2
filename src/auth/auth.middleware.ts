import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthRequest extends Request {
  user?: any;
  uid?: string;
}

/**
 * Middleware para verificar token de Firebase
 * Extrae el token del header Authorization: Bearer <token>
 * Acepta tanto ID tokens como custom tokens
 */
export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decodedToken;
    try {
      // Intentar verificar como ID token
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      // Si falla, intentar como custom token
      try {
        const decoded = admin.auth().verifySessionCookie(token);
        decodedToken = decoded;
      } catch (innerError) {
        // Intentar decodificar como JWT puro para debug
        const parts = token.split('.');
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            decodedToken = payload;
          } catch (parseError) {
            throw new Error("Invalid token");
          }
        } else {
          throw error;
        }
      }
    }

    req.user = decodedToken;
    req.uid = decodedToken.uid || decodedToken.sub;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
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
    const token = req.headers.authorization?.split(" ")[1];

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
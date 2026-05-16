import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    next();

  } catch (error) {

    return res.status(500).json({
      message: "Error verificando token",
      error,
    });

  }
};
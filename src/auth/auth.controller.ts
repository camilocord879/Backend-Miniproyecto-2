import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
} from "./auth.services";
import { AuthRequest } from "./auth.middleware";
export const register = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password son obligatorios",
      });
    }

    const user = await registerUser(
      email,
      password
    );

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user,
    });

  } catch (error: any) {

    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        error: "El correo ya está registrado",
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password son obligatorios",
      });
    }

    const result = await loginUser(
      email,
      password
    );

    return res.status(200).json(result);

  } catch (error: any) {

    if (
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};
export const me = (
  req: AuthRequest,
  res: Response
) => {

  return res.status(200).json({
    user: req.user,
  });

};
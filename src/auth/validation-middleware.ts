import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware para validar el body con Zod
 */
export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      // Error de validación Zod
      if (error.errors) {
        const formattedErrors = error.errors.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Validation error",
          details: formattedErrors,
        });
      }

      return res.status(400).json({
        error: "Invalid request data",
      });
    }
  };

import { z } from "zod";

/**
 * Palabras reservadas que no pueden usarse como username
 */
const RESERVED_USERNAMES = [
  "admin",
  "root",
  "firebase",
  "system",
  "test",
  "api"
];

/**
 * Validar que el username no sea reservado
 */
const isNotReservedUsername = (
  username: string
) => {

  return !RESERVED_USERNAMES.includes(
    username.toLowerCase()
  );

};

/**
 * Schema para registro manual
 */
export const registerSchema = z.object({

  names: z
    .string()
    .min(
      2,
      "Names must be at least 2 characters"
    )
    .max(
      50,
      "Names must not exceed 50 characters"
    )
    .trim(),

  lastNames: z
    .string()
    .min(
      2,
      "Last names must be at least 2 characters"
    )
    .max(
      50,
      "Last names must not exceed 50 characters"
    )
    .trim(),

  username: z
    .string()
    .min(
      3,
      "Username must be at least 3 characters"
    )
    .max(
      30,
      "Username must not exceed 30 characters"
    )
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .transform(
      (val) => val.toLowerCase()
    )
    .refine(
      isNotReservedUsername,
      "This username is reserved and cannot be used"
    ),

  avatar: z
    .string()
    .optional()
    .default(
      "avatar1.svg"
    ),

  email: z
    .string()
    .email(
      "Invalid email format"
    )
    .toLowerCase(),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    )
    .max(
      128,
      "Password must not exceed 128 characters"
    ),

});

export type RegisterInput =
  z.infer<typeof registerSchema>;

/**
 * Schema para login
 */
export const loginSchema = z.object({

  email: z
    .string()
    .email(
      "Invalid email format"
    )
    .toLowerCase(),

  password: z
    .string()
    .min(
      1,
      "Password is required"
    ),

});

export type LoginInput =
  z.infer<typeof loginSchema>;

/**
 * Schema para completar perfil Google
 */
export const completeGoogleProfileSchema =
  z.object({

    username: z
      .string()
      .min(
        3,
        "Username must be at least 3 characters"
      )
      .max(
        30,
        "Username must not exceed 30 characters"
      )
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      )
      .transform(
        (val) => val.toLowerCase()
      )
      .refine(
        isNotReservedUsername,
        "This username is reserved and cannot be used"
      ),

  });

export type CompleteGoogleProfileInput =
  z.infer<
    typeof completeGoogleProfileSchema
  >;

/**
 * Schema para actualizar perfil
 */
export const updateProfileSchema =
  z.object({

    names: z
      .string()
      .min(
        2,
        "Names must be at least 2 characters"
      )
      .max(
        50,
        "Names must not exceed 50 characters"
      )
      .trim()
      .optional(),

    lastNames: z
      .string()
      .min(
        2,
        "Last names must be at least 2 characters"
      )
      .max(
        50,
        "Last names must not exceed 50 characters"
      )
      .trim()
      .optional(),

    username: z
      .string()
      .min(
        3,
        "Username must be at least 3 characters"
      )
      .max(
        30,
        "Username must not exceed 30 characters"
      )
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      )
      .transform(
        (val) => val.toLowerCase()
      )
      .refine(
        isNotReservedUsername,
        "This username is reserved and cannot be used"
      )
      .optional(),

    avatar: z
      .string()
      .optional(),

  }).refine(

    (data) =>
      Object.keys(data).length > 0,

    {
      message:
        "At least one field is required",
    }

  );

/**
 * Schema para Google Auth
 */
export const googleAuthSchema =
  z.object({

    idToken: z
      .string()
      .min(
        1,
        "ID token is required"
      ),

  });

export type GoogleAuthInput =
  z.infer<typeof googleAuthSchema>;
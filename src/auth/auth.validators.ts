import { RegisterDTO } from "./auth.dto";

export const validateRegisterDTO = (data: any): RegisterDTO => {
  if (!data.names || typeof data.names !== "string" || data.names.trim() === "") {
    throw new Error("INVALID_NAMES");
  }

  if (!data.lastNames || typeof data.lastNames !== "string" || data.lastNames.trim() === "") {
    throw new Error("INVALID_LAST_NAMES");
  }

  if (!data.username || typeof data.username !== "string" || data.username.trim() === "") {
    throw new Error("INVALID_USERNAME");
  }

  if (data.username.length < 3 || data.username.length > 30) {
    throw new Error("USERNAME_LENGTH_INVALID");
  }

  if (!data.avatar || typeof data.avatar !== "string" || data.avatar.trim() === "") {
    throw new Error("INVALID_AVATAR");
  }

  if (!data.email || typeof data.email !== "string" || !isValidEmail(data.email)) {
    throw new Error("INVALID_EMAIL");
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    throw new Error("INVALID_PASSWORD");
  }

  return {
    names: data.names.trim(),
    lastNames: data.lastNames.trim(),
    username: data.username.trim(),
    avatar: data.avatar.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_]+$/.test(username);
};

import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

interface User {
  id: number;
  email: string;
  password: string;
}

const users: User[] = [];

export const registerUser = async (
  email: string,
  password: string
) => {

  const existingUser = users.find(
    (user) => user.email === email
  );

  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = users.find(
    (user) => user.email === email
  );

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};
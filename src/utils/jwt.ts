import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "secret";

const JWT_EXPIRES =
  (process.env.JWT_EXPIRES || "1h") as SignOptions["expiresIn"];

export const generateToken = (
  payload: object
) => {

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

};

export const verifyToken = (
  token: string
) => {

  return jwt.verify(token, JWT_SECRET);

};
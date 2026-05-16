import { db } from "../config/firebase";
import { User } from "../models/user.model";

const usersCollection = db.collection("users");

export const createUser = async (user: User) => {
  if (!user.username || user.username.trim() === "") {
  throw new Error("Username obligatorio");
}
  // verificar username repetido
  const snapshot = await usersCollection
    .where("username", "==", user.username)
    .get();

  if (!snapshot.empty) {
    throw new Error("El username ya existe");
  }
  const emailExists = await usersCollection
  .where("email", "==", user.email)
  .get();

if (!emailExists.empty) {
  throw new Error("El email ya existe");
}
  // crear usuario
  const docRef = await usersCollection.add({
    ...user,
    createdAt: new Date(),
  });

  return {
    firestoreId: docRef.id,
    ...user,
  };
};

export const getAllUsers = async () => {

  const snapshot = await usersCollection.get();

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    firestoreId: doc.id,
  }));
};

export const getUserById = async (id: string) => {

  const doc = await usersCollection.doc(id).get();

  if (!doc.exists) {
    throw new Error("Usuario no encontrado");
  }

  return {
    ...doc.data(),
    firestoreId: doc.id,
  };
};
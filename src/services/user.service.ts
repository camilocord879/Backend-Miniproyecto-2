import { db } from "../config/firebase";
import { User } from "../models/user.model";

const usersCollection = db.collection("users");

export const createUser = async (user: User) => {
  const snapshot = await usersCollection
    .where("username", "==", user.username)
    .get();

  if (!snapshot.empty) {
    throw new Error("El username ya existe");
  }

  const docRef = await usersCollection.add({
    ...user,
    createdAt: new Date(),
  });

  return {
    id: docRef.id,
    ...user,
  };
};

export const getAllUsers = async () => {
  const snapshot = await usersCollection.get();

  return snapshot.docs.map((doc) => ({
  ...doc.data(),
  firestoreId: doc.id,
}));};

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
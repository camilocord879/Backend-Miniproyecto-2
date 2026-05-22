export interface User {
  uid: string;
  firestoreId: string;
  names: string;
  lastNames: string;
  username: string;
  email: string;
  avatar: string;
  provider: "manual" | "google";
  createdAt: Date;
  updatedAt?: Date;
}
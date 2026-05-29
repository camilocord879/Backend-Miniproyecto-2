import { randomUUID } from "crypto";
import { db } from "../config/firebase";
import { Room } from "../models/room.model";

export const createRoom = async (
  name: string,
  ownerId: string
): Promise<Room> => {

  const roomId = randomUUID();

  const room: Room = {
    id: roomId,
    name,
    ownerId,
    participants: [ownerId],
    createdAt: new Date(),
  };

  await db
    .collection("rooms")
    .doc(roomId)
    .set(room);

  return room;
};

export const getRooms = async (
  userId: string
): Promise<Room[]> => {

  const snapshot = await db
    .collection("rooms")
    .where("ownerId", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Room, "id">),
  }));

};

export const getRoomById = async (
  roomId: string
): Promise<Room | null> => {

  const doc = await db
    .collection("rooms")
    .doc(roomId)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...(doc.data() as Omit<Room, "id">),
  };

};

export const updateRoom = async (
  roomId: string,
  name: string
): Promise<Room> => {

  const roomRef = db
    .collection("rooms")
    .doc(roomId);

  await roomRef.update({
    name,
  });

  const updatedDoc = await roomRef.get();

  return {
    id: updatedDoc.id,
    ...(updatedDoc.data() as Omit<Room, "id">),
  };

};

export const deleteRoom = async (
  roomId: string
): Promise<void> => {

  await db
    .collection("rooms")
    .doc(roomId)
    .delete();

};

export const joinRoom = async (
  roomId: string,
  userId: string
): Promise<Room> => {

  const roomRef = db
    .collection("rooms")
    .doc(roomId);

  const roomDoc = await roomRef.get();

  if (!roomDoc.exists) {
    throw new Error("Room not found");
  }

  const roomData = roomDoc.data() as Room;

  const participants = roomData.participants || [];

  if (!participants.includes(userId)) {
    participants.push(userId);
  }

  await roomRef.update({
    participants,
  });

  const updatedRoom = await roomRef.get();

  return {
    id: updatedRoom.id,
    ...(updatedRoom.data() as Omit<Room, "id">),
  };

};

export const leaveRoom = async (
  roomId: string,
  userId: string
): Promise<Room> => {

  const roomRef = db
    .collection("rooms")
    .doc(roomId);

  const roomDoc = await roomRef.get();

  if (!roomDoc.exists) {
    throw new Error("Room not found");
  }

  const roomData = roomDoc.data() as Room;

  const participants = (roomData.participants || []).filter(
    (participantId: string) =>
      participantId !== userId
  );

  await roomRef.update({
    participants,
  });

  const updatedRoom = await roomRef.get();

  return {
    id: updatedRoom.id,
    ...(updatedRoom.data() as Omit<Room, "id">),
  };

};
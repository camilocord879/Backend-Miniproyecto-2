import { db } from "../config/firebase";
import { v4 as uuid } from "uuid";
import { Message } from "../models/message.model";

export const createMessage = async (
  roomId: string,
  senderId: string,
  content: string
): Promise<Message> => {

  const messageData = {
    roomId,
    senderId,
    content,
    createdAt: new Date()
  };

  const messageId = uuid();

  await db
    .collection("messages")
    .doc(messageId)
    .set(messageData);

  return {
    id: messageId,
    ...messageData
  };

};
export const getRoomMessages = async (
  roomId: string
) => {

  const snapshot = await db
    .collection("messages")
    .where(
      "roomId",
      "==",
      roomId
    )
    .orderBy(
      "createdAt",
      "asc"
    )
    .get();

  const messages = snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );

  return messages;

};

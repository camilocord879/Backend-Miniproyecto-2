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
  roomId: string,
  limit: number = 30,
  before?: string
) => {

  let query = db
    .collection("messages")
    .where("roomId", "==", roomId)
    .orderBy("createdAt", "desc");

  // If a cursor is provided, get messages older than that timestamp
  if (before) {
    const cursorDoc = await db.collection("messages").doc(before).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  query = query.limit(limit);

  const snapshot = await query.get();

  const messages = snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );

  // Return in chronological order (oldest first)
  return messages.reverse();

};

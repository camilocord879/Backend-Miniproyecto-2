import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { setIO } from "./store";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  setIO(io);

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  console.log("Socket.IO activo");

  return io;
};
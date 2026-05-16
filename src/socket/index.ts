import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initializeSocket = (httpServer: HttpServer) => {

  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log(`Cliente conectado: ${socket.id}`);

    // Evento de prueba
    socket.emit("message", "Conexion exitosa con Socket.IO");

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });

  });

  console.log("Socket.IO activo");

  return io;
};
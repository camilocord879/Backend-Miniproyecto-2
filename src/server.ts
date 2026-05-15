import http from "http";
import dotenv from "dotenv";

import app from "./app";
import { initializeSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
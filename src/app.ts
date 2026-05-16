import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import userRoutes from "./routes/user.route";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoutes);
/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica que el servidor funciona
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 */
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente");
});
app.get("/ping", (_req, res) => {
  res.json({
    message: "Servidor funcionando correctamente"
  });
});

export default app;

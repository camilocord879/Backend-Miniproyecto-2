import dotenv from "dotenv";
import "./config/firebase";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // El puerto de tu frontend
  credentials: true
}));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
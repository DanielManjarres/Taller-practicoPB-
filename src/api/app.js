import express from "express";
import routes from "../routes/index.js";
import errorHandler from "../middlewares/errorHandler.js";

const app = express();

// Middleware para JSON
app.use(express.json());

// Rutas base
app.use("/api", routes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Middleware global de errores
app.use(errorHandler);

export default app;

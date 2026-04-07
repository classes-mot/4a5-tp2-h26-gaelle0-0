import express from "express";
import { connectDB } from "./util/bd.js";
import gamesRoutes from "./routes/games-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./util/http-error.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/jeux", gamesRoutes);
app.use("/api/users", usersRoutes);

// Route inexistante
app.use((req, res, next) => {
  next(new HttpError("Route non trouvée", 404));
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Erreur inconnue" });
});

// Connexion BD + démarrage serveur
connectDB();

app.listen(5000, () => {
  console.log("Serveur démarré sur le port 5000 ");
});

export default app;

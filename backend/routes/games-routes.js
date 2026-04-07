import express from "express";
import { check } from "express-validator";
import gamesController from "../controllers/games-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

// Middleware pour obtenir toutes les tâches
router.get("/", gamesController.getGames);
router.get("/:gid", gamesController.getGamesById);

//token requis
router.use(checkAuth);

router.post(
  "/",
  [
    check("nom").not().isEmpty(),
    check("categorie").not().isEmpty(),
    check("duree").not().isEmpty(),
    check("nbJoueurs").not().isEmpty(),
  ],
  gamesController.createGame,
);

router.patch("/:gid", gamesController.updateGame);

router.delete("/:gid", gamesController.deleteGame);

export default router;

import express from "express";
import { check } from "express-validator";
import usersController from "../controllers/users-controller.js";

const router = express.Router();

router.post(
  "/inscription",
  [
    check("nom").not().isEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("motDePasse").isLength({ min: 6 }),
  ],
  usersController.inscription,
);

// POST /api/users/connexion
router.post(
  "/connexion",
  [
    check("email").normalizeEmail().isEmail(),
    check("motDePasse").not().isEmpty(),
  ],
  usersController.connexion,
);

export default router;

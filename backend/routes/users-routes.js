import express from "express";

import usersController from "../controllers/users-controller.js";
const router = express.Router();

// Middleware pour obtenir toutes les tâches
//liste de users
router.get("/", usersController.getUsers);

router.get("/profile/:uid", usersController.getUserById);

router.post("/register", usersController.registerUser);
// list
router.post("/login", usersController.login);

router.patch("/profile/:uid", usersController.updateUserById);

export default router;

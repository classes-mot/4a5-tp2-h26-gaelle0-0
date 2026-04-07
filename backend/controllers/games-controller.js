import Game from "../models/game.js";
import { validationResult } from "express-validator";
import HttpError from "../util/http-error.js";

const getGames = async (req, res, next) => {
  let games;
  try {
    games = await Game.find();
  } catch (error) {
    return next(new HttpError("Erreur serveur", 500));
  }
  res.json({ games: games.map((game) => game.toObject({ getters: true })) });
};

const getGamesById = async (req, res, next) => {
  const gameId = req.params.gid;
  let game;
  try {
    game = await Game.findById(gameId);
  } catch (error) {
    return next(new HttpError("Erreur serveur", 500));
  }
  if (!game) {
    return next(new HttpError("Jeu non trouvé", 404));
  }
  res.json({ game: game.toObject({ getters: true }) });
};

const createGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Données invalides", 422));
  }
  const { nom, categorie, duree, nbJoueurs } = req.body;
  const newGame = new Game({
    nom,
    categorie,
    duree,
    nbJoueurs,
  });

  try {
    await newGame.save();
  } catch (error) {
    return next(new HttpError("Erreur d'enregistrement du jeu", 500));
  }
  res.status(201).json({ game: newGame.toObject({ getters: true }) });
};

const updateGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Données invalides", 422));
  }

  const gameId = req.params.gid;
  const { nom, categorie, duree, nbJoueurs } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (error) {
    return next(new HttpError("Erreur serveur", 500));
  }

  if (!game) {
    return next(new HttpError("Jeu non trouvé", 404));
  }

  game.nom = nom;
  game.categorie = categorie;
  game.duree = duree;
  game.nbJoueurs = nbJoueurs;

  try {
    await game.save();
  } catch (error) {
    return next(new HttpError("Erreur de mise à jour du jeu", 500));
  }

  res.json({ game: game.toObject({ getters: true }) });
};

const deleteGame = async (req, res, next) => {
  const gameId = req.params.gid;
  let game;
  try {
    game = await Game.findById(gameId);
  } catch (error) {
    return next(new HttpError("Erreur serveur", 500));
  }
  if (!game) {
    return next(new HttpError("Jeu non trouvé", 404));
  }
  try {
    await game.deleteOne();
  } catch (error) {
    return next(new HttpError("Erreur de suppression du jeu", 500));
  }
  res.json({ message: "Jeu supprimé" });
};

export default {
  getGames,
  getGamesById,
  createGame,
  updateGame,
  deleteGame,
};

import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

let MOCK_USERS = [
  {
    id: "1",
    nom: "Alice",
    email: "alice@example.com",
    motDePasse: "password123",
  },
  {
    id: "2",
    nom: "Bob",
    email: "bob@example.com",
    motDePasse: "password456",
  },
];

const getUser = (req, res, next) => {
  setTimeout(() => {
    res.json({ users: MOCK_USERS });
  }, 3000);
};

//POST /api/users/inscription
const inscription = async (req, res, next) => {
  const { nom, email, motDePasse } = req.body;
  //verifier si l email existe déjà dans la base de données
  let emailExiste;
  try {
    emailExiste = await User.findOne({ email: email });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  if (emailExiste) {
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
  }

  //encripter le mot de passe
  let mdpEncrypte;
  try {
    mdpEncrypte = await bcrypt.hash(motDePasse, 12);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }

  //nouvel utilisateur
  const newUser = new User({
    nom,
    email,
    motDePasse: mdpEncrypte,
  });

  try {
    await newUser.save();
  } catch (error) {
    return res.status(500).json({ message: "Erreur d'inscription" });
  }

  //générer un token JWT
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
  } catch (error) {
    return res.status(500).json({ message: "Erreur d'inscription" });
  }

  MOCK_USERS.push(newUser);
  res.status(201).json({ user: newUser, email: newUser.email, token: token });
};

//POST /api/users/connexion
const connexion = async (req, res, next) => {
  const { email, motDePasse } = req.body;

  //verifier si l email existe dans la base de données
  let utilisateurExiste;
  try {
    utilisateurExiste = await User.findOne({ email: email });
  } catch (error) {
    return res.status(500).json({ message: "Erreur de connexion" });
  }

  if (!utilisateurExiste) {
    return res.status(401).json({ message: "Email ou mot de passe invalide" });
  }

  //verifier le mot de passe
  let motDePasseValide;
  try {
    motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateurExiste.motDePasse,
    );
  } catch (error) {
    return res.status(500).json({ message: "Erreur de connexion" });
  }

  if (!motDePasseValide) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  //générer un token JWT
  let token;
  try {
    token = jwt.sign(
      { userId: utilisateurExiste.id, email: utilisateurExiste.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
  } catch (error) {
    return res.status(500).json({ message: "Erreur de connexion" });
  }

  res.json({
    userId: utilisateurExiste.id,
    email: utilisateurExiste.email,
    token: token,
  });
};

export default { getUser, inscription, connexion };

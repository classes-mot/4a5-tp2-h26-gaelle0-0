import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, "votre_clé_secrète");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed", 401));
  }
};

export default checkAuth;

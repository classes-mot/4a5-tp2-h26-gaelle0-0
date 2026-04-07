import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { type: String, required: true },
  duree: { type: Number, required: true },
  nbJoueurs: { type: Number, required: true },
});

export default mongoose.model("Game", gameSchema);

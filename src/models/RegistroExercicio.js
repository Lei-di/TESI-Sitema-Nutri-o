import mongoose from "mongoose";
import { RegistroSaude } from "./RegistroSaude.js";

const registroExercicioSchema = new mongoose.Schema({
  tipoExercicio: {
    type: String,
    required: true
  },
  duracao: {
    type: Number,
    required: true
  },
  calorias: {
    type: Number,
    required: true
  }
});

registroExercicioSchema.methods.calcularCalorias = function() {
  return this.calorias;
};

export const RegistroExercicio = RegistroSaude.discriminator("Exercicio", registroExercicioSchema);
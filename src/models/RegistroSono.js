import mongoose from "mongoose";
import { RegistroSaude } from "./RegistroSaude.js";

const registroSonoSchema = new mongoose.Schema({
  horasDormidas: {
    type: Number,
    required: true
  },
  qualidadeSono: {
    type: String,
    required: true
  }
});

registroSonoSchema.methods.validarHoras = function() {
  return this.horasDormidas >= 0 && this.horasDormidas <= 24;
};

export const RegistroSono = RegistroSaude.discriminator("Sono", registroSonoSchema);
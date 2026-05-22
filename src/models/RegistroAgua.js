import mongoose from "mongoose";
import { RegistroSaude } from "./RegistroSaude.js";

const registroAguaSchema = new mongoose.Schema({
  quantidadeLitros: {
    type: Number,
    required: true
  }
});

registroAguaSchema.methods.validarQuantidade = function() {
  return this.quantidadeLitros > 0;
};

export const RegistroAgua = RegistroSaude.discriminator("Agua", registroAguaSchema);
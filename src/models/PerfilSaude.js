import mongoose from "mongoose";

const perfilSaudeSchema = new mongoose.Schema({
  peso: { type: Number, required: true },
  altura: { type: Number, required: true },
  idade: { type: Number, required: true },
  metaAgua: { type: Number, required: true },
  metaExercicio: { type: Number, required: true },

  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
}, { timestamps: true });

perfilSaudeSchema.methods.calcularIMC = function () {
  return parseFloat((this.peso / (this.altura * this.altura)).toFixed(2));
};

export const PerfilSaude = mongoose.model("PerfilSaude", perfilSaudeSchema);
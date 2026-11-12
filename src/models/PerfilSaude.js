import mongoose from "mongoose";

const perfilSaudeSchema = new mongoose.Schema(
  {
    peso: {
      type: Number,
      required: true,
      min: 1,
    },
    altura: {
      type: Number,
      required: true,
      min: 0.5,
    },
    idade: {
      type: Number,
      required: true,
      min: 1,
    },
    metaAgua: {
      type: Number,
      required: true,
      min: 0.1,
    },
    metaExercicio: {
      type: Number,
      required: true,
      min: 1,
    },
    imc: {
      type: Number,
      default: null,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

perfilSaudeSchema.methods.calcularIMC = function () {
  return Number(
    (this.peso / (this.altura * this.altura)).toFixed(2)
  );
};

export const PerfilSaude = mongoose.model(
  "PerfilSaude",
  perfilSaudeSchema
);
import mongoose from "mongoose";

const registroSaudeOptions = {
  discriminatorKey: "tipo", 
  timestamps: true
};

const registroSaudeSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  data: {
    type: String,
    required: true
  },
  observacoes: {
    type: String
  }
}, registroSaudeOptions);

export const RegistroSaude = mongoose.model("RegistroSaude", registroSaudeSchema);
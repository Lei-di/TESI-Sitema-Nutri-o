import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  telefone: { 
    type: String 
  }
}, { 
  timestamps: true
});

export const Usuario = mongoose.model("Usuario", usuarioSchema);
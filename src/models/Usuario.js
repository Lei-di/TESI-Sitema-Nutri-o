import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Por favor, insira um e-mail válido."
        ]
    },

    telefone: {
        type: String,
        required: true
    },

    senha: {
        type: String,
        required: true
    },

    perfil: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario",
        required: true
    }
});

usuarioSchema.pre("save", async function () {
    if (!this.isModified("senha")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
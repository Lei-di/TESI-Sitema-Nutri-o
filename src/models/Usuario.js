import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    senha: { type: String, required: true }
});

usuarioSchema.pre('save', async function () {
    const usuario = this;

    if (!usuario.isModified('senha')) {
        return; 
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(usuario.senha, salt);

        usuario.senha = hash;
        
    } catch (err) {
        throw err;
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
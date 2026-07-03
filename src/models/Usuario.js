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
    console.log('>>> Hook pre-save foi chamado');

    // Se a senha não foi modificada, encerra a função sem fazer nada
    if (!usuario.isModified('senha')) {
        return; 
    }

    try {
        // Gera o salt e o hash de forma assíncrona (sem callbacks)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(usuario.senha, salt);
        
        console.log('>>> Hash gerado:', hash);

        // Atribui a senha criptografada ao usuário
        usuario.senha = hash;
        
    } catch (err) {
        // Em caso de erro na criptografia, repassa para o Mongoose tratar
        throw err;
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
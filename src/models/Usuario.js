import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    senha: { type: String, required: true }
});


usuarioSchema.pre('save', function (next) {
    const usuario = this;
    console.log('>>> Hook pre-save foi chamado');

    if (!usuario.isModified('senha')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(usuario.senha, salt, function (err, hash) {
            if (err) return next(err);
            console.log('>>> Hash gerado:', hash);

            usuario.senha = hash;
            next();
        });
    });
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
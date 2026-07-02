import  Usuario  from "../models/Usuario.js";

export const criarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;

        const novoUsuario = new Usuario({ nome, email, telefone, senha });
        await novoUsuario.save();

        return res.status(201).json(novoUsuario);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

export const buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

export const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            id,
            { nome, email, telefone },
            { new: true, runValidators: true }
        );
        if (!usuarioAtualizado) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }
        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        return res.status(400).json({ erro: error.message });
    }
};

export const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioDeletado = await Usuario.findByIdAndDelete(id);
        if (!usuarioDeletado) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }
        return res.status(200).json({ mensagem: "Utilizador removido com sucesso!" });
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};
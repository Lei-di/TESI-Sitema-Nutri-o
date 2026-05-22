import { Usuario } from "../models/Usuario.js";

export const criarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;

        const novoUsuario = new Usuario({ nome, email, telefone });
        await novoUsuario.save();

        return res.status(201).json(novoUsuario); 
    } catch (error) {
        return res.status(400).json({ erro: error.message });
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
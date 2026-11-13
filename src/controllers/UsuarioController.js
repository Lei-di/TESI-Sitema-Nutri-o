
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";

// Retorna apenas os dados que podem ser enviados ao frontend.
function dadosPublicos(usuario) {
    return {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        perfil: usuario.perfil || "usuario"
    };
}

// Verifica se o usuário autenticado pode acessar o cadastro solicitado.
function podeAcessar(req, id) {
    return (
        req.usuarioPerfil === "admin" ||
        String(req.usuarioId) === String(id)
    );
}

// CADASTRAR USUÁRIO
export const criarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;

        // O perfil não é recebido do formulário.
        // Todo cadastro público será usuario.
        const novoUsuario = new Usuario({
            nome,
            email,
            telefone,
            senha,
            perfil: "usuario"
        });

        await novoUsuario.save();

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: dadosPublicos(novoUsuario)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                erro: error.message
            });
        }

        console.error("Erro ao cadastrar usuário:", error);

        return res.status(500).json({
            erro: "Erro interno ao cadastrar usuário."
        });
    }
};

// LISTAR TODOS OS USUÁRIOS
// A rota exige perfil admin.
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-senha");

        return res.status(200).json(usuarios);

    } catch (error) {
        console.error("Erro ao listar usuários:", error);

        return res.status(500).json({
            erro: "Erro ao listar usuários."
        });
    }
};

// BUSCAR USUÁRIO POR ID
export const buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                erro: "Identificador de usuário inválido."
            });
        }

        if (!podeAcessar(req, id)) {
            return res.status(403).json({
                erro: "Você não tem permissão para acessar este usuário."
            });
        }

        const usuario = await Usuario.findById(id).select("-senha");

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        return res.status(200).json(usuario);

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);

        return res.status(500).json({
            erro: "Erro ao buscar usuário."
        });
    }
};

// ATUALIZAR USUÁRIO
export const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                erro: "Identificador de usuário inválido."
            });
        }

        if (!podeAcessar(req, id)) {
            return res.status(403).json({
                erro: "Você não tem permissão para alterar este usuário."
            });
        }

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        const { nome, email, telefone } = req.body;

        // Atualiza somente os campos permitidos.
        // perfil e senha não podem ser alterados por esta rota.
        if (nome !== undefined) {
            usuario.nome = nome;
        }

        if (email !== undefined) {
            usuario.email = email.trim().toLowerCase();
        }

        if (telefone !== undefined) {
            usuario.telefone = telefone;
        }

        await usuario.save();

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            usuario: dadosPublicos(usuario)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                erro: error.message
            });
        }

        console.error("Erro ao atualizar usuário:", error);

        return res.status(500).json({
            erro: "Erro ao atualizar usuário."
        });
    }
};

// DELETAR USUÁRIO
// A rota exige perfil admin.
export const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                erro: "Identificador de usuário inválido."
            });
        }

        const usuarioDeletado = await Usuario.findByIdAndDelete(id);

        if (!usuarioDeletado) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Usuário removido com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao excluir usuário:", error);

        return res.status(500).json({
            erro: "Erro ao excluir usuário."
        });
    }
};

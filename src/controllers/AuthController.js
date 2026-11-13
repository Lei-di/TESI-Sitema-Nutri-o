import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Informe o e-mail e a senha."
            });
        }

        const usuario = await Usuario.findOne({
            email: email.toLowerCase().trim()
        });

        if (!usuario) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        const perfil = usuario.perfil || "usuario";

        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                perfil: perfil
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,

            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: perfil
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);

        return res.status(500).json({
            erro: "Erro interno ao realizar login."
        });
    }
};
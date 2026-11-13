
import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            erro: "Token não fornecido. Faça login para continuar."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({
                erro: "Token inválido ou expirado. Faça login novamente."
            });
        }

        req.usuarioId = payload.id;

        // Só existem dois perfis no sistema.
        // Tokens antigos sem perfil são tratados como usuario.
        req.usuarioPerfil =
            payload.perfil === "admin" ? "admin" : "usuario";

        next();
    });
};

// Middleware para permitir somente administradores.
export const exigirAdmin = (req, res, next) => {
    if (!req.usuarioId) {
        return res.status(401).json({
            erro: "Autenticação necessária."
        });
    }

    if (req.usuarioPerfil !== "admin") {
        return res.status(403).json({
            erro: "Acesso negado. Somente administradores podem realizar esta operação."
        });
    }

    next();
};

export default autenticarToken;

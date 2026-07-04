import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // formato esperado: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ erro: "Token não fornecido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido ou expirado." });
        }
        req.usuarioId = payload.id;
        next();
    });
};

export default autenticarToken;
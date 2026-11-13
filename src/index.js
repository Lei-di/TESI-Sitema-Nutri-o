
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import cors from "cors";

import { conectarBanco } from "./config/db.js";
import { usuarioRoutes } from "./routes/usuarioRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { saudeRoutes } from "./routes/SaudeRoutes.js";
import { perfilSaudeRoutes } from "./routes/perfilSaudeRoutes.js";
import { autenticarToken } from "./middlewares/authMiddleware.js";

const app = express();
const PORT = 3000;

// Permite a comunicação com o frontend Next.js.
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Verificação do servidor.
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

// Rotas de usuários e autenticação.
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);

// Rotas protegidas.
app.use("/saude", autenticarToken, saudeRoutes);
app.use("/perfis", autenticarToken, perfilSaudeRoutes);

console.log("Iniciando o Servidor de Nutrição...");

conectarBanco()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Servidor rodando com sucesso em http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("Erro ao iniciar o servidor:", error);
    });

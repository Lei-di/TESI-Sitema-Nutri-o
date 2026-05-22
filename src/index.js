import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]); //dns

import express from "express";
import { conectarBanco } from "./config/db.js";
import { usuarioRoutes } from "./routes/usuarioRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/usuarios", usuarioRoutes);

console.log("Iniciando o Servidor de Nutrição... ");

conectarBanco().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando com sucesso em http://localhost:${PORT} `);
    });
});
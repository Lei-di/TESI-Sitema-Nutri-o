import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]); //dns

import { conectarBanco } from "./config/db.js";

console.log("Iniciando o Sistema de Nutrição... 🥗");

conectarBanco();
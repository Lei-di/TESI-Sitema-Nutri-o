import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const conectarBanco = async () => {
    try {
        const URL = process.env.MONGODB_URI;

        if (!URL) {
            throw new Error("A variável MONGODB_URI não foi definida no arquivo .env");
        }

        await mongoose.connect(URL);
        console.log("Conexão com o MongoDB Atlas realizada com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error.message);
        process.exit(1);
    }
};
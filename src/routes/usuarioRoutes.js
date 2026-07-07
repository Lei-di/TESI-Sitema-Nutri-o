import { autenticarToken } from "../middlewares/authMiddleware.js";
import { Router } from "express";
import { criarUsuario, listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } from "../controllers/UsuarioController.js";
import validarUsuario from "../middlewares/validarUsuario.js"; 

const router = Router();

router.post("/", validarUsuario, criarUsuario);
router.get("/", autenticarToken, listarUsuarios);
router.get("/:id", autenticarToken, buscarUsuarioPorId);
router.put("/:id", autenticarToken, atualizarUsuario);
router.delete("/:id", autenticarToken, deletarUsuario);

export { router as usuarioRoutes };
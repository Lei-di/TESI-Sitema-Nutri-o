import { Router } from "express";
import { criarUsuario, listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } from "../controllers/UsuarioController.js";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export { router as usuarioRoutes };
import { Router } from "express";
import { criarUsuario, listarUsuarios } from "../controllers/UsuarioController.js";

const router = Router();

router.post("/", criarUsuario); 
router.get("/", listarUsuarios);

export { router as usuarioRoutes };
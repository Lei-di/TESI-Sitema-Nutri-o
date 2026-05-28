import { Router } from "express";
import { salvarPerfilSaude, obterPerfilSaude, deletarPerfilSaude } from "../controllers/PerfilSaudeController.js";

const router = Router();

router.post("/", salvarPerfilSaude);
router.get("/usuario/:usuarioId", obterPerfilSaude);
router.delete("/usuario/:usuarioId", deletarPerfilSaude);

export { router as perfilSaudeRoutes };
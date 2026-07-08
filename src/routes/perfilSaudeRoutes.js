import { Router } from "express";
import { salvarPerfilSaude, obterPerfilSaude, deletarPerfilSaude } from "../controllers/PerfilSaudeController.js";

const router = Router();

router.post("/", salvarPerfilSaude);
router.get("/", obterPerfilSaude);
router.delete("/", deletarPerfilSaude);

export { router as perfilSaudeRoutes };
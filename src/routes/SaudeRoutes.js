import { Router } from "express";
import { criarRegistroSaude, listarRegistrosSaude, buscarRegistroPorData, atualizarRegistroSaude, excluirRegistroSaude } from "../controllers/ControladorSaude.js";

const router = Router();

router.post("/", criarRegistroSaude);
router.get("/", listarRegistrosSaude);
router.get("/filtro", buscarRegistroPorData);
router.put("/:id", atualizarRegistroSaude);
router.delete("/:id", excluirRegistroSaude);

export { router as saudeRoutes };
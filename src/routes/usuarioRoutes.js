
import { Router } from "express";

import {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    atualizarUsuario,
    deletarUsuario
} from "../controllers/UsuarioController.js";

import validarUsuario from "../middlewares/validarUsuario.js";

import {
    autenticarToken,
    exigirAdmin
} from "../middlewares/authMiddleware.js";

const router = Router();

// Cadastro público: todo cadastro recebe o perfil usuario.
router.post("/", validarUsuario, criarUsuario);

// Somente administrador pode listar todos os usuários.
router.get("/", autenticarToken, exigirAdmin, listarUsuarios);

// Usuário consulta somente o próprio cadastro.
// Administrador pode consultar qualquer cadastro.
router.get("/:id", autenticarToken, buscarUsuarioPorId);

// Usuário edita somente o próprio cadastro.
// Administrador pode editar qualquer cadastro.
router.put("/:id", autenticarToken, atualizarUsuario);

// Somente administrador pode excluir usuários.
router.delete("/:id", autenticarToken, exigirAdmin, deletarUsuario);

export { router as usuarioRoutes };


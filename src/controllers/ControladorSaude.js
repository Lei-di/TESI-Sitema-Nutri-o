import { DiarioSaude } from "../models/DiarioSaude.js";
import { RegistroSaude } from "../models/RegistroSaude.js";
import { RegistroAgua } from "../models/RegistroAgua.js";
import { RegistroSono } from "../models/RegistroSono.js";
import { RegistroExercicio } from "../models/RegistroExercicio.js";

// CREATE - Adicionar um registo no Diário
export const criarRegistroSaude = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const { tipo, data, observacoes, ...dados } = req.body;

        if (!tipo || !data) {
            return res.status(400).json({ erro: "Campos obrigatórios: tipo e data." });
        }

        const diario = new DiarioSaude(usuarioId);
        let novoRegistro;

        switch (tipo.toLowerCase()) {
            case "agua":
                novoRegistro = new RegistroAgua({ usuario: usuarioId, data, observacoes, quantidadeLitros: dados.quantidadeLitros });
                break;
            case "sono":
                novoRegistro = new RegistroSono({ usuario: usuarioId, data, observacoes, horasDormidas: dados.horasDormidas, qualidadeSono: dados.qualidadeSono });
                break;
            case "exercicio":
                novoRegistro = new RegistroExercicio({ usuario: usuarioId, data, observacoes, tipoExercicio: dados.tipoExercicio, duracao: dados.duracao, calorias: dados.calorias });
                break;
            default:
                return res.status(400).json({ erro: "Tipo inválido. Utilize: agua, sono ou exercicio." });
        }

        const salvo = await diario.adicionarRegistro(novoRegistro);
        return res.status(201).json(salvo);
    } catch (error) {
        return res.status(400).json({ erro: error.message });
    }
};

// READ - Listar diário do utilizador autenticado
export const listarRegistrosSaude = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const diario = new DiarioSaude(usuarioId);
        const registros = await diario.listarRegistros();
        return res.status(200).json(registros);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

// READ - Filtrar diário do utilizador autenticado por uma data
export const buscarRegistroPorData = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const { data } = req.query; // passado via URL como ?data=2026-05-28
        const diario = new DiarioSaude(usuarioId);
        const registros = await diario.buscarPorData(data);
        return res.status(200).json(registros);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

// UPDATE - Atualizar registo por ID (somente se pertencer ao utilizador autenticado)
export const atualizarRegistroSaude = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await RegistroSaude.findById(id);

        if (!registro) {
            return res.status(404).json({ erro: "Registo não encontrado." });
        }
        if (registro.usuario.toString() !== req.usuarioId) {
            return res.status(403).json({ erro: "Você não tem permissão para alterar este registo." });
        }

        const diario = new DiarioSaude(req.usuarioId);
        const atualizado = await diario.atualizarRegistro(id, req.body);
        return res.status(200).json(atualizado);
    } catch (error) {
        return res.status(400).json({ erro: error.message });
    }
};

// DELETE - Remover registo por ID (somente se pertencer ao utilizador autenticado)
export const excluirRegistroSaude = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await RegistroSaude.findById(id);

        if (!registro) {
            return res.status(404).json({ erro: "Registo não encontrado." });
        }
        if (registro.usuario.toString() !== req.usuarioId) {
            return res.status(403).json({ erro: "Você não tem permissão para remover este registo." });
        }

        const diario = new DiarioSaude(req.usuarioId);
        await diario.excluirRegistro(id);
        return res.status(200).json({ mensagem: "Registo removido do diário com sucesso!" });
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};
import { DiarioSaude } from "../models/DiarioSaude.js";
import { RegistroAgua } from "../models/RegistroAgua.js";
import { RegistroSono } from "../models/RegistroSono.js";
import { RegistroExercicio } from "../models/RegistroExercicio.js";

// CREATE - Adicionar um registo no Diário
export const criarRegistroSaude = async (req, res) => {
    try {
        const { usuarioId, tipo, data, observacoes, ...dados } = req.body;

        if (!usuarioId || !tipo || !data) {
            return res.status(400).json({ erro: "Campos obrigatórios: usuarioId, tipo e data." });
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

// READ - Listar diário de um utilizador
export const listarRegistrosSaude = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const diario = new DiarioSaude(usuarioId);
        const registros = await diario.listarRegistros();
        return res.status(200).json(registros);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

// READ - Filtrar diário por uma data
export const buscarRegistroPorData = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { data } = req.query; // passado via URL como ?data=2026-05-28
        const diario = new DiarioSaude(usuarioId);
        const registros = await diario.buscarPorData(data);
        return res.status(200).json(registros);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

// UPDATE - Atualizar registo por ID
export const atualizarRegistroSaude = async (req, res) => {
    try {
        const { id } = req.params;
        const diario = new DiarioSaude(null);
        const atualizado = await diario.atualizarRegistro(id, req.body);
        if (!atualizado) return res.status(404).json({ erro: "Registo não encontrado." });
        return res.status(200).json(atualizado);
    } catch (error) {
        return res.status(400).json({ erro: error.message });
    }
};

// DELETE - Remover registo por ID
export const excluirRegistroSaude = async (req, res) => {
    try {
        const { id } = req.params;
        const diario = new DiarioSaude(null);
        const deletado = await diario.excluirRegistro(id);
        if (!deletado) return res.status(404).json({ erro: "Registo não encontrado." });
        return res.status(200).json({ mensagem: "Registo removido do diário com sucesso!" });
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};
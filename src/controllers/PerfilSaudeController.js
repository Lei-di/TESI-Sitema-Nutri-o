import { PerfilSaude } from "../models/PerfilSaude.js";

// CREATE / UPDATE (Usa findOneAndUpdate com upsert para garantir um único perfil por utilizador)
export const salvarPerfilSaude = async (req, res) => {
    try {
        const { usuarioId, peso, altura, idade, metaAgua, metaExercicio } = req.body;

        if (!usuarioId || !peso || !altura) {
            return res.status(400).json({ erro: "usuarioId, peso e altura são obrigatórios." });
        }

        // Instancia o modelo temporariamente para executar o método calcularIMC() do vosso esquema
        const instanciaPerfil = new PerfilSaude({ peso, altura, idade, metaAgua, metaExercicio, usuario: usuarioId });
        const imcCalculado = instanciaPerfil.calcularIMC();

        const perfil = await PerfilSaude.findOneAndUpdate(
            { usuario: usuarioId },
            { peso, altura, idade, metaAgua, metaExercicio, imc: imcCalculado },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json(perfil);
    } catch (error) {
        return res.status(400).json({ erro: error.message });
    }
};

// READ - Obter o perfil do utilizador
export const obterPerfilSaude = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const perfil = await PerfilSaude.findOne({ usuario: usuarioId }).populate("usuario", "nome email");
        if (!perfil) {
            return res.status(404).json({ erro: "Perfil de saúde não encontrado." });
        }
        return res.status(200).json(perfil);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};

// DELETE - Remover perfil
export const deletarPerfilSaude = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const removido = await PerfilSaude.findOneAndDelete({ usuario: usuarioId });
        if (!removido) {
            return res.status(404).json({ erro: "Perfil de saúde não encontrado." });
        }
        return res.status(200).json({ mensagem: "Perfil de saúde removido com sucesso!" });
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
};
import { RegistroSaude } from "./RegistroSaude.js";

export class DiarioSaude {
  constructor(usuario) {
    this.usuario = usuario; 
  }

  async adicionarRegistro(registro) {
    registro.usuario = this.usuario._id || this.usuario;
    return await registro.save();
  }

  async atualizarRegistro(id, novosDados) {
    return await RegistroSaude.findByIdAndUpdate(id, novosDados, { new: true });
  }
  async excluirRegistro(id) {
    return await RegistroSaude.findByIdAndDelete(id);
  }

  async listarRegistros() {
    return await RegistroSaude.find({ usuario: this.usuario._id || this.usuario });
  }

  async buscarPorData(data) {
    return await RegistroSaude.find({
      usuario: this.usuario._id || this.usuario,
      data: data
    });
  }
}
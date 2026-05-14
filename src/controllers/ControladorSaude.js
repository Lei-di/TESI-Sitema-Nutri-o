export class ControladorSaude {
  constructor(diarioSaude) {
    this.diarioSaude = diarioSaude;
  }

  criarRegistro(registro) {
    this.diarioSaude.adicionarRegistro(registro);
  }

  editarRegistro(id, novosDados) {
    this.diarioSaude.atualizarRegistro(id, novosDados);
  }

  excluirRegistro(id) {
    this.diarioSaude.excluirRegistro(id);
  }

  listarRegistros() {
    return this.diarioSaude.listarRegistros();
  }
}
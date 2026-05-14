export class DiarioSaude {
  constructor(usuario) {
    this.usuario = usuario;
    this.registros = []; // Lista<RegistroSaude>
  }

  adicionarRegistro(registro) {
    this.registros.push(registro);
  }

  atualizarRegistro(id, novosDados) {
    const index = this.registros.findIndex(r => r.id === id);
    if (index !== -1) this.registros[index] = { ...this.registros[index], ...novosDados };
  }

  excluirRegistro(id) {
    this.registros = this.registros.filter(r => r.id !== id);
  }

  listarRegistros() {
    return this.registros;
  }

  buscarPorData(data) {
    return this.registros.find(r => r.data === data);
  }
}
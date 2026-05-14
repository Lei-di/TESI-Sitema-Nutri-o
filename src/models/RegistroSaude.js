export class RegistroSaude {
  constructor(id, data, observacoes) {
    this.id = id;
    this.data = data;
    this.observacoes = observacoes;
  }

  salvar() { console.log("Registro salvo."); }
  editar() { console.log("Registro editado."); }
  remover() { console.log("Registro removido."); }
}
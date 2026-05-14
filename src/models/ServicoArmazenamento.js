export class ServicoArmazenamento {
  constructor(chave_armazenamento) {
    this.chave_armazenamento = chave_armazenamento;
  }

  salvarDados() { console.log("Dados persistidos."); }
  carregarDados() { console.log("Dados carregados."); }
  limparDados() { console.log("Dados removidos."); }
} 
export class RelatorioSaude {
  constructor(dataInicio, dataFim) {
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }

  gerarRelatorioSemanal() {
    return `Relatório Semanal de ${this.dataInicio} a ${this.dataFim}`;
  }

  gerarRelatorioMensal() {
    return `Relatório Mensal de ${this.dataInicio} a ${this.dataFim}`;
  }
}
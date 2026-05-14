import { RegistroSaude } from './RegistroSaude.js';

export class RegistroExercicio extends RegistroSaude {
  constructor(id, data, observacoes, tipoExercicio, duracao, calorias) {
    super(id, data, observacoes);
    this.tipoExercicio = tipoExercicio;
    this.duracao = duracao;
    this.calorias = calorias;
  }

  calcularCalorias() {
    return this.calorias;
  }
} 
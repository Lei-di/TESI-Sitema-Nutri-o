import { RegistroSaude } from './RegistroSaude.js';

export class RegistroAgua extends RegistroSaude {
  constructor(id, data, observacoes, quantidadeLitros) {
    super(id, data, observacoes);
    this.quantidadeLitros = quantidadeLitros;
  }

  validarQuantidade() {
    return this.quantidadeLitros > 0;
  }
}
import { RegistroSaude } from './RegistroSaude.js';

export class RegistroSono extends RegistroSaude {
  constructor(id, data, observacoes, horasDormidas, qualidadeSono) {
    super(id, data, observacoes);
    this.horasDormidas = horasDormidas;
    this.qualidadeSono = qualidadeSono;
  }

  validarHoras() {
    return this.horasDormidas >= 0 && this.horasDormidas <= 24;
  }
} 
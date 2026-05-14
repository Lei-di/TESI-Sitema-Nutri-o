export class PerfilSaude {
  constructor(peso, altura, idade, metaAgua, metaExercicio) {
    this.peso = peso;
    this.altura = altura;
    this.idade = idade;
    this.metaAgua = metaAgua;
    this.metaExercicio = metaExercicio;
  }

  calcularIMC() {
    return parseFloat((this.peso / (this.altura * this.altura)).toFixed(2));
  }

  atualizarMetas() {
    console.log("Metas de saúde atualizadas.");
  }
}
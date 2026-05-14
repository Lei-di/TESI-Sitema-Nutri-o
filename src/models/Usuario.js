export class Usuario {
  constructor(id_usuario, nome, email, telefone) {
    this.id_usuario = id_usuario;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }

  login() {
    console.log(`Usuário ${this.nome} logado.`);
  }

  logout() {
    console.log(`Usuário ${this.nome} deslogado.`);
  }

  atualizarPerfil() {
    console.log("Perfil de usuário atualizado.");
  }
}
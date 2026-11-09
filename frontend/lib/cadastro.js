export const CAMPOS_CADASTRO = ["nome", "email", "telefone", "senha"];

export function normalizarCadastro(dados) {
  return {
    nome: dados.nome.trim().replace(/\s+/g, " "),
    email: dados.email.trim(),
    telefone: dados.telefone.replace(/\D/g, ""),
    senha: dados.senha,
  };
}

export function validarCampoCadastro(campo, valor) {
  if (campo === "nome") {
    const nome = valor.trim().replace(/\s+/g, " ");
    if (!nome) return "Informe seu nome.";
    if (nome.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) return "Use apenas letras e espaços no nome.";
  }
  if (campo === "email") {
    const email = valor.trim();
    if (!email) return "Informe seu e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido, como voce@exemplo.com.";
  }
  if (campo === "telefone") {
    const telefone = valor.replace(/\D/g, "");
    if (!telefone) return "Informe seu telefone com DDD.";
    if (!/^\d{10,11}$/.test(telefone)) return "O telefone deve ter 10 ou 11 números, incluindo o DDD.";
  }
  if (campo === "senha") {
    if (!valor) return "Crie uma senha.";
    if (valor.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(valor)) {
      return "Inclua ao menos uma letra maiúscula, uma minúscula e um número.";
    }
  }
  return "";
}

export function validarCadastro(dados) {
  return Object.fromEntries(CAMPOS_CADASTRO
    .map((campo) => [campo, validarCampoCadastro(campo, dados[campo])])
    .filter(([, erro]) => erro));
}

export function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 2) return numeros;
  const ddd = numeros.slice(0, 2);
  const restante = numeros.slice(2);
  if (restante.length <= 4) return `(${ddd}) ${restante}`;
  const tamanhoPrefixo = restante.length > 8 ? 5 : 4;
  return `(${ddd}) ${restante.slice(0, tamanhoPrefixo)}-${restante.slice(tamanhoPrefixo)}`;
}

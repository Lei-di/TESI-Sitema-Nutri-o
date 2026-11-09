import test from "node:test";
import assert from "node:assert/strict";
import { normalizarCadastro, validarCadastro, formatarTelefone } from "./cadastro.js";

const valido = { nome: "João da Silva", email: "joao@example.com", telefone: "(65) 99999-1234", senha: "Saude1" };

test("aceita os campos válidos e prepara o telefone para a API sem alterar a senha", () => {
  assert.deepEqual(validarCadastro(valido), {});
  const dados = normalizarCadastro({ ...valido, nome: "  João   da Silva  ", email: " joao@example.com ", senha: " Saude1 " });
  assert.deepEqual(dados, { nome: "João da Silva", email: "joao@example.com", telefone: "65999991234", senha: " Saude1 " });
});

test("campos vazios e espaços geram erros em todos os campos obrigatórios", () => {
  const erros = validarCadastro({ nome: "   ", email: "  ", telefone: "", senha: "" });
  assert.deepEqual(Object.keys(erros), ["nome", "email", "telefone", "senha"]);
});

test("rejeita nome curto ou numérico, email inválido e telefone sem DDD", () => {
  assert.ok(validarCadastro({ ...valido, nome: "Al" }).nome);
  assert.ok(validarCadastro({ ...valido, nome: "João 123" }).nome);
  assert.ok(validarCadastro({ ...valido, email: "joao@" }).email);
  assert.ok(validarCadastro({ ...valido, telefone: "99999-1234" }).telefone);
  assert.ok(validarCadastro({ ...valido, telefone: "659999912345" }).telefone);
});

test("aplica todas as regras de senha do back-end", () => {
  for (const senha of ["Aa1", "abcdef1", "ABCDEF1", "Abcdef", "123456"]) {
    assert.ok(validarCadastro({ ...valido, senha }).senha, senha);
  }
  assert.deepEqual(validarCadastro({ ...valido, senha: "Abcde1" }), {});
});

test("formata telefones fixos e celulares e limita a digitação a 11 números", () => {
  assert.equal(formatarTelefone(""), "");
  assert.equal(formatarTelefone("65"), "65");
  assert.equal(formatarTelefone("6533331234"), "(65) 3333-1234");
  assert.equal(formatarTelefone("65999991234"), "(65) 99999-1234");
  assert.equal(formatarTelefone("6599999123456"), "(65) 99999-1234");
  assert.equal(normalizarCadastro({ ...valido, telefone: "(65) 3333-1234" }).telefone, "6533331234");
});

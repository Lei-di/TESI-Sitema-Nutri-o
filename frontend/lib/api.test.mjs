import assert from "node:assert/strict";
import test from "node:test";
import { apiRequest, ApiError, usuarioApi, authApi } from "./api.js";

test("entrada envia e-mail e senha ao endpoint existente, com controle de tempo", async (t) => {
  const signal = new AbortController().signal;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "/api/backend/auth/login");
    assert.equal(options.method, "POST");
    assert.equal(options.signal, signal);
    assert.deepEqual(JSON.parse(options.body), { email: "ana@example.com", senha: "Senha123" });
    return Response.json({ token: "token-simulado", usuario: { id: "teste", nome: "Ana" } });
  });
  const resultado = await authApi.login("ana@example.com", "Senha123", { signal });
  assert.equal(resultado.token, "token-simulado");
  assert.equal(resultado.usuario.nome, "Ana");
});

test("entrada preserva a mensagem de credenciais inválidas da API", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ erro: "E-mail ou senha inválidos." }, { status: 401 }));
  await assert.rejects(authApi.login("ana@example.com", "incorreta"), (erro) => erro instanceof ApiError && erro.status === 401 && erro.message === "E-mail ou senha inválidos.");
});

test("cadastro envia os quatro campos como JSON, sem autenticação", async (t) => {
  const dados = { nome: "Maria Silva", email: "maria@example.com", telefone: "65999999999", senha: "Senha123" };
  const signal = new AbortController().signal;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "/api/backend/usuarios");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.get("Content-Type"), "application/json");
    assert.equal(options.headers.has("Authorization"), false);
    assert.equal(options.signal, signal);
    assert.equal(options.cache, "no-store");
    assert.deepEqual(JSON.parse(options.body), dados);
    return Response.json({ _id: "usuario-teste", nome: dados.nome }, { status: 201 });
  });
  assert.deepEqual(await usuarioApi.criar(dados, { signal }), { _id: "usuario-teste", nome: dados.nome });
});

test("validação 400 preserva todas as mensagens do back-end", async (t) => {
  const mensagens = ["O nome deve ter no mínimo 3 caracteres.", "Por favor, insira um e-mail válido."];
  t.mock.method(globalThis, "fetch", async () => Response.json({ erros: mensagens }, { status: 400 }));
  await assert.rejects(usuarioApi.criar({}), (error) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 400);
    assert.deepEqual(error.errors, mensagens);
    assert.equal(error.message, mensagens.join(" "));
    return true;
  });
});

test("e-mail duplicado 409 preserva a mensagem para orientar a correção", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ erro: "Este e-mail já está cadastrado." }, { status: 409 }));
  await assert.rejects(usuarioApi.criar({}), (error) => error.status === 409 && error.message === "Este e-mail já está cadastrado.");
});

test("erros 500 e gateway HTML não vazam detalhes do servidor", async (t) => {
  for (const status of [500, 502, 503, 504]) {
    const fetchMock = t.mock.method(globalThis, "fetch", async () => status === 500
      ? Response.json({ erro: "MongoServerError: credentials secret-host" }, { status })
      : new Response("<html>Internal gateway error: secret-host</html>", { status }));
    await assert.rejects(usuarioApi.criar({}), (error) => {
      assert.equal(error.status, status);
      assert.match(error.message, /indisponível/);
      assert.doesNotMatch(error.message, /Mongo|secret-host|html/);
      assert.deepEqual(error.errors, []);
      return true;
    });
    fetchMock.mock.restore();
  }
});

test("falha de rede recebe uma mensagem compreensível", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new TypeError("fetch failed"); });
  await assert.rejects(usuarioApi.criar({}), (error) => error instanceof ApiError && error.status === 0 && /Verifique sua conexão/.test(error.message));
});

test("resposta HTML com status 200 não é interpretada como cadastro concluído", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>Outra página</html>"));
  await assert.rejects(usuarioApi.criar({}), (error) => error instanceof ApiError && /resposta inesperada/.test(error.message));
});

test("cliente existente mantém suporte a Bearer e respostas sem corpo", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.headers.get("Authorization"), "Bearer token-teste");
    assert.equal(options.headers.get("X-Request-Test"), "ok");
    return new Response(null, { status: 204 });
  });
  assert.equal(await apiRequest("/perfis", { token: "token-teste", headers: { "X-Request-Test": "ok" } }), null);
});

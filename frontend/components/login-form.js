"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import styles from "@/app/cadastro/cadastro.module.css";

const INICIAL = { email: "", senha: "" };

function validarCampo(campo, valor) {
  if (campo === "email") {
    if (!valor.trim()) return "Informe seu e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) return "Informe um e-mail válido, como voce@exemplo.com.";
  }
  if (campo === "senha" && !valor) return "Informe sua senha.";
  return "";
}

export default function LoginForm() {
  const [dados, setDados] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const envioEmCurso = useRef(false);
  const formulario = useRef(null);
  const erroGeral = useRef(null);
  const tituloSucesso = useRef(null);

  useEffect(() => {
    if (mensagem) erroGeral.current?.focus();
  }, [mensagem]);

  useEffect(() => {
    if (usuario) tituloSucesso.current?.focus();
  }, [usuario]);

  function alterar(event) {
    const { name, value } = event.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
    if (erros[name]) setErros((anterior) => ({ ...anterior, [name]: validarCampo(name, value) }));
    setMensagem("");
  }

  function validarAoSair(event) {
    const { name, value } = event.target;
    setErros((anterior) => ({ ...anterior, [name]: validarCampo(name, value) }));
  }

  function propriedades(campo) {
    return {
      id: `login-${campo}`,
      name: campo,
      value: dados[campo],
      onChange: alterar,
      onBlur: validarAoSair,
      required: true,
      "aria-invalid": Boolean(erros[campo]),
      "aria-describedby": erros[campo] ? `login-${campo}-erro` : undefined,
    };
  }

  async function entrar(event) {
    event.preventDefault();
    if (envioEmCurso.current) return;
    const novosErros = Object.fromEntries(["email", "senha"]
      .map((campo) => [campo, validarCampo(campo, dados[campo])])
      .filter(([, erro]) => erro));
    setErros(novosErros);
    setMensagem("");
    const primeiroErro = ["email", "senha"].find((campo) => novosErros[campo]);
    if (primeiroErro) {
      formulario.current.elements.namedItem(primeiroErro)?.focus();
      return;
    }

    envioEmCurso.current = true;
    setEnviando(true);
    try {
      const resultado = await authApi.login(dados.email.trim(), dados.senha, {
        signal: AbortSignal.timeout(15000),
      });
      if (typeof resultado?.token !== "string" || !resultado.token.trim()
        || typeof resultado?.usuario?.nome !== "string" || !resultado.usuario.nome.trim()) {
        throw new ApiError("O serviço retornou uma resposta inesperada. Tente novamente.", 200);
      }

      const usuarioAutenticado = {
        id: resultado.usuario.id,
        nome: resultado.usuario.nome,
        email: resultado.usuario.email,
      };
      try {
        sessionStorage.setItem("healthlog-session", JSON.stringify({
          token: resultado.token,
          usuario: usuarioAutenticado,
        }));
      } catch {
        setMensagem("Não foi possível manter seu acesso neste navegador. Permita o armazenamento local e tente novamente.");
        return;
      }

      setDados(INICIAL);
      setMostrarSenha(false);
      setUsuario(usuarioAutenticado);
    } catch (erro) {
      setMensagem(erro instanceof ApiError
        ? (erro.status === 401 ? "E-mail ou senha inválidos. Confira seus dados e tente novamente." : erro.message)
        : "Não foi possível entrar na sua conta. Tente novamente em instantes.");
    } finally {
      envioEmCurso.current = false;
      setEnviando(false);
    }
  }

  if (usuario) {
    return (
      <section className={`${styles.card} ${styles.success}`} aria-labelledby="login-success-title">
        <div role="status" aria-live="polite">
          <span className={styles.successIcon} aria-hidden="true">✓</span>
          <p className="eyebrow">BEM-VINDO DE VOLTA</p>
          <h2 id="login-success-title" ref={tituloSucesso} tabIndex={-1}>Você entrou na sua conta</h2>
          <p>Olá, {usuario.nome}! Seu acesso foi realizado com sucesso.</p>
        </div>
        <Link href="/" className={styles.primaryLink}>Voltar ao início <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  return (
    <section className={styles.card} aria-labelledby="login-title">
      <h2 id="login-title" className={styles.cardTitle}>Entre na sua conta</h2>
      <p className={styles.cardDescription}>Que bom ter você por aqui de novo.</p>
      <p className={styles.requiredNote}>Use o e-mail e a senha do seu cadastro.</p>
      <form ref={formulario} onSubmit={entrar} noValidate aria-busy={enviando}>
        {mensagem && (
          <div className={styles.errorSummary} role="alert" ref={erroGeral} tabIndex={-1}>{mensagem}</div>
        )}
        <fieldset disabled={enviando} className={styles.fields}>
          <legend className={styles.srOnly}>Dados de acesso</legend>
          <div className={styles.field}>
            <label htmlFor="login-email">E-mail</label>
            <input {...propriedades("email")} type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="voce@exemplo.com" />
            {erros.email && <p id="login-email-erro" className={styles.fieldError}>{erros.email}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="login-senha">Senha</label>
            <div className={styles.password}>
              <input {...propriedades("senha")} type={mostrarSenha ? "text" : "password"} autoComplete="current-password" placeholder="Sua senha" />
              <button className={styles.passwordToggle} type="button" onClick={() => setMostrarSenha((anterior) => !anterior)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} aria-controls="login-senha" aria-pressed={mostrarSenha}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{mostrarSenha && <path d="m3 3 18 18" />}</svg>
              </button>
            </div>
            {erros.senha && <p id="login-senha-erro" className={styles.fieldError}>{erros.senha}</p>}
          </div>
          <button type="submit" className={styles.submit}>{enviando ? "Entrando…" : "Entrar"}{!enviando && <span aria-hidden="true">→</span>}</button>
        </fieldset>
        <p className={styles.formNote} role="status">{enviando ? "Aguarde enquanto verificamos seu acesso." : "Continue sua jornada de cuidado."}</p>
      </form>
      <div className={styles.accountAccess}>
        <p>Ainda não tem conta?</p>
        <Link href="/cadastro" className={styles.secondaryLink}>Criar conta</Link>
      </div>
    </section>
  );
}

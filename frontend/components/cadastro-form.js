"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ApiError, usuarioApi } from "@/lib/api";
import { CAMPOS_CADASTRO, formatarTelefone, normalizarCadastro, validarCadastro, validarCampoCadastro } from "@/lib/cadastro";
import styles from "@/app/cadastro/cadastro.module.css";

const INICIAL = { nome: "", email: "", telefone: "", senha: "" };

export default function CadastroForm() {
  const [dados, setDados] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [mensagens, setMensagens] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const envioEmCurso = useRef(false);
  const formulario = useRef(null);
  const erroGeral = useRef(null);
  const tituloSucesso = useRef(null);

  useEffect(() => {
    if (concluido) tituloSucesso.current?.focus();
  }, [concluido]);

  function alterar(event) {
    const { name, value } = event.target;
    const valor = name === "telefone" ? formatarTelefone(value) : value;
    setDados((anterior) => ({ ...anterior, [name]: valor }));
    if (erros[name]) {
      setErros((anterior) => ({ ...anterior, [name]: validarCampoCadastro(name, valor) }));
    }
    setMensagens([]);
  }

  function validarAoSair(event) {
    const { name, value } = event.target;
    setErros((anterior) => ({ ...anterior, [name]: validarCampoCadastro(name, value) }));
  }

  function propriedades(campo, ajuda) {
    return {
      id: `cadastro-${campo}`,
      name: campo,
      value: dados[campo],
      onChange: alterar,
      onBlur: validarAoSair,
      required: true,
      "aria-invalid": Boolean(erros[campo]),
      "aria-describedby": [ajuda, erros[campo] ? `${campo}-erro` : null].filter(Boolean).join(" ") || undefined,
    };
  }

  async function cadastrar(event) {
    event.preventDefault();
    if (envioEmCurso.current) return;
    const novosErros = validarCadastro(dados);
    setErros(novosErros);
    setMensagens([]);
    const primeiroErro = CAMPOS_CADASTRO.find((campo) => novosErros[campo]);
    if (primeiroErro) {
      formulario.current.elements.namedItem(primeiroErro)?.focus();
      return;
    }

    envioEmCurso.current = true;
    setEnviando(true);
    try {
      await usuarioApi.criar(normalizarCadastro(dados), { signal: AbortSignal.timeout(15000) });
      setDados(INICIAL);
      setMostrarSenha(false);
      setConcluido(true);
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 409) {
        setErros({ email: erro.message });
        // Aguarda a reativação dos campos antes de mover o foco.
        requestAnimationFrame(() => formulario.current?.elements.namedItem("email")?.focus());
      } else {
        const novasMensagens = erro instanceof ApiError
          ? (erro.errors?.length ? erro.errors : [erro.message])
          : [erro.name === "TimeoutError"
            ? "O envio demorou mais que o esperado. Tente novamente."
            : "Não foi possível enviar seu cadastro. Verifique sua conexão e tente novamente."];
        setMensagens(novasMensagens);
        requestAnimationFrame(() => erroGeral.current?.focus());
      }
    } finally {
      envioEmCurso.current = false;
      setEnviando(false);
    }
  }

  if (concluido) {
    return (
      <section className={`${styles.card} ${styles.success}`} aria-labelledby="success-title">
        <div role="status" aria-live="polite">
          <span className={styles.successIcon} aria-hidden="true">✓</span>
          <p className="eyebrow">PRIMEIRO PASSO CONCLUÍDO</p>
          <h2 id="success-title" ref={tituloSucesso} tabIndex={-1}>Sua conta foi criada!</h2>
          <p>Bem-vindo ao HealthLog. Seu cadastro foi realizado com sucesso.</p>
        </div>
        <Link href="/login" className={styles.primaryLink}>Entrar na minha conta <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  return (
    <section className={styles.card} aria-labelledby="form-title">
      <h2 id="form-title" className={styles.cardTitle}>Crie sua conta</h2>
      <p className={styles.cardDescription}>Um espaço para cuidar de você.</p>
      <p className={styles.requiredNote}>Todos os campos são obrigatórios.</p>
      <form ref={formulario} onSubmit={cadastrar} noValidate aria-busy={enviando}>
        {mensagens.length > 0 && (
          <div className={styles.errorSummary} role="alert" ref={erroGeral} tabIndex={-1}>
            <strong>Não foi possível concluir o cadastro.</strong>
            <ul>{mensagens.map((mensagem, indice) => <li key={`${indice}-${mensagem}`}>{mensagem}</li>)}</ul>
          </div>
        )}
        <fieldset disabled={enviando} className={styles.fields}>
          <legend className={styles.srOnly}>Dados da sua conta</legend>
          <div className={styles.field}>
            <label htmlFor="cadastro-nome">Nome</label>
            <input {...propriedades("nome")} type="text" autoComplete="name" placeholder="Como você se chama?" />
            {erros.nome && <p id="nome-erro" className={styles.fieldError}>{erros.nome}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="cadastro-email">E-mail</label>
            <input {...propriedades("email")} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="voce@exemplo.com" />
            {erros.email && <p id="email-erro" className={styles.fieldError}>{erros.email}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="cadastro-telefone">Telefone</label>
            <input {...propriedades("telefone", "telefone-ajuda")} type="tel" inputMode="tel" autoComplete="tel-national" maxLength={15} placeholder="(65) 99999-9999" />
            <p id="telefone-ajuda" className={styles.help}>Inclua o DDD do seu telefone.</p>
            {erros.telefone && <p id="telefone-erro" className={styles.fieldError}>{erros.telefone}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="cadastro-senha">Senha</label>
            <div className={styles.password}>
              <input {...propriedades("senha", "senha-ajuda")} type={mostrarSenha ? "text" : "password"} autoComplete="new-password" placeholder="Crie uma senha" />
              <button className={styles.passwordToggle} type="button" onClick={() => setMostrarSenha((anterior) => !anterior)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} aria-controls="cadastro-senha" aria-pressed={mostrarSenha}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{mostrarSenha && <path d="m3 3 18 18" />}</svg>
              </button>
            </div>
            <p id="senha-ajuda" className={styles.help}>Pelo menos 6 caracteres, com maiúscula, minúscula e número.</p>
            {erros.senha && <p id="senha-erro" className={styles.fieldError}>{erros.senha}</p>}
          </div>
          <button type="submit" className={styles.submit}>
            {enviando ? "Criando sua conta…" : "Criar minha conta"}
            {!enviando && <span aria-hidden="true">→</span>}
          </button>
        </fieldset>
        <p className={styles.formNote} role="status">{enviando ? "Aguarde enquanto concluímos seu cadastro." : "Um pequeno passo para uma rotina com mais cuidado."}</p>
      </form>
      <div className={styles.accountAccess}>
        <p>Já possui uma conta?</p>
        <Link href="/login" className={styles.secondaryLink}>Já tenho conta</Link>
      </div>
    </section>
  );
}

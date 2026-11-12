"use client";

import { useEffect, useState } from "react";
import AppShell from "../../components/app-shell";
import { ApiError, perfilApi } from "../../lib/api";
import styles from "./perfil.module.css";

const valoresIniciais = {
  peso: "",
  altura: "",
  idade: "",
  metaAgua: "2",
  metaExercicio: "30",
};

export default function PerfilPage() {
  const [dados, setDados] = useState(valoresIniciais);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [temPerfil, setTemPerfil] = useState(false);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const sessao = JSON.parse(
          sessionStorage.getItem("healthlog-session") || "{}"
        );

        if (!sessao.token) {
          return;
        }

        const perfil = await perfilApi.obter(sessao.token);

        setDados({
          peso: String(perfil.peso ?? ""),
          altura: String(perfil.altura ?? ""),
          idade: String(perfil.idade ?? ""),
          metaAgua: String(perfil.metaAgua ?? "2"),
          metaExercicio: String(perfil.metaExercicio ?? "30"),
        });

        setTemPerfil(true);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setTemPerfil(false);
        } else {
          setErro(error.message);
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setDados((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensagem("");
    setErro("");
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    const peso = Number(dados.peso);
    const altura = Number(dados.altura);
    const idade = Number(dados.idade);
    const metaAgua = Number(dados.metaAgua);
    const metaExercicio = Number(dados.metaExercicio);

    if (
      !peso || peso <= 0 ||
      !altura || altura <= 0 ||
      !idade || idade <= 0 ||
      !metaAgua || metaAgua <= 0 ||
      !metaExercicio || metaExercicio <= 0
    ) {
      setErro("Preencha todos os campos com valores válidos.");
      return;
    }

    if (altura > 3) {
      setErro("Informe a altura em metros. Exemplo: 1,65.");
      return;
    }

    try {
      setSalvando(true);

      const sessao = JSON.parse(
        sessionStorage.getItem("healthlog-session") || "{}"
      );

      if (!sessao.token) {
        setErro("Sua sessão expirou. Entre novamente.");
        return;
      }

      const resultado = await perfilApi.salvar(
        {
          peso,
          altura,
          idade,
          metaAgua,
          metaExercicio,
        },
        sessao.token
      );

      setTemPerfil(true);

      if (resultado.imc != null) {
        setMensagem(
          `Perfil salvo com sucesso! Seu IMC é ${Number(resultado.imc).toFixed(2)}.`
        );
      } else {
        const imc = peso / (altura * altura);
        setMensagem(
          `Perfil salvo com sucesso! Seu IMC é ${imc.toFixed(2)}.`
        );
      }
    } catch (error) {
      setErro(error.message || "Não foi possível salvar o perfil.");
    } finally {
      setSalvando(false);
    }
  }

  const imcCalculado =
    Number(dados.peso) > 0 &&
    Number(dados.altura) > 0 &&
    Number(dados.altura) <= 3
      ? (
          Number(dados.peso) /
          (Number(dados.altura) * Number(dados.altura))
        ).toFixed(2)
      : null;

  return (
    <AppShell>
      <section className={styles.container}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>MINHA CONTA</span>
            <h1>Perfil de saúde</h1>
            <p>
              Informe seus dados pessoais e defina suas metas
              para acompanhar sua saúde.
            </p>
          </div>
        </div>

        {carregando ? (
          <div className={styles.messageBox}>
            Carregando seus dados...
          </div>
        ) : (
          <form
            className={styles.form}
            onSubmit={salvarPerfil}
          >
            <div className={styles.card}>
              <div className={styles.cardHeading}>
                <div className={styles.cardIcon}>♡</div>
                <div>
                  <h2>Dados pessoais</h2>
                  <p>Informações para seu acompanhamento.</p>
                </div>
              </div>

              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>Peso (kg)</span>
                  <input
                    type="number"
                    name="peso"
                    value={dados.peso}
                    onChange={atualizarCampo}
                    placeholder="Ex.: 65"
                    min="1"
                    step="0.1"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Altura (m)</span>
                  <input
                    type="number"
                    name="altura"
                    value={dados.altura}
                    onChange={atualizarCampo}
                    placeholder="Ex.: 1.65"
                    min="0.5"
                    max="3"
                    step="0.01"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Idade (anos)</span>
                  <input
                    type="number"
                    name="idade"
                    value={dados.idade}
                    onChange={atualizarCampo}
                    placeholder="Ex.: 22"
                    min="1"
                    max="120"
                    step="1"
                    required
                  />
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeading}>
                <div className={styles.cardIcon}>◎</div>
                <div>
                  <h2>Metas diárias</h2>
                  <p>Defina objetivos para sua rotina.</p>
                </div>
              </div>

              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>Meta de água (litros)</span>
                  <input
                    type="number"
                    name="metaAgua"
                    value={dados.metaAgua}
                    onChange={atualizarCampo}
                    placeholder="Ex.: 2"
                    min="0.1"
                    step="0.1"
                    required
                  />
                  <small>Quantidade de água por dia.</small>
                </label>

                <label className={styles.field}>
                  <span>Meta de exercícios (minutos)</span>
                  <input
                    type="number"
                    name="metaExercicio"
                    value={dados.metaExercicio}
                    onChange={atualizarCampo}
                    placeholder="Ex.: 30"
                    min="1"
                    step="1"
                    required
                  />
                  <small>Tempo de atividade física por dia.</small>
                </label>
              </div>
            </div>

            <div className={styles.imcCard}>
              <div>
                <span className={styles.imcLabel}>
                  ÍNDICE DE MASSA CORPORAL
                </span>
                <h2>{imcCalculado ?? "--"}</h2>
                <p>
                  O IMC é calculado automaticamente com seu
                  peso e sua altura.
                </p>
              </div>
              <span className={styles.imcIcon}>⌁</span>
            </div>

            {erro && (
              <div className={styles.error} role="alert">
                {erro}
              </div>
            )}

            {mensagem && (
              <div className={styles.success} role="status">
                {mensagem}
              </div>
            )}

            <div className={styles.actions}>
              <span>
                {temPerfil
                  ? "Você pode atualizar seus dados quando precisar."
                  : "Seus dados serão vinculados à sua conta."}
              </span>

              <button
                type="submit"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : temPerfil
                    ? "Atualizar perfil"
                    : "Salvar perfil"}
              </button>
            </div>
          </form>
        )}
      </section>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/app-shell";
import { saudeApi } from "../../lib/api";
import styles from "./dashboard.module.css";

function obterDataLocal(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function interpretarData(valor) {
  if (!valor) return null;

  const texto = String(valor);

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    const [ano, mes, dia] = texto.slice(0, 10).split("-").map(Number);
    return new Date(ano, mes - 1, dia);
  }

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarData(valor) {
  const data = interpretarData(valor);

  if (!data) return "Data não informada";

  return data.toLocaleDateString("pt-BR");
}

function obterTipo(registro) {
  return String(registro.tipo || "").toLowerCase();
}

export default function DashboardPage() {
  const router = useRouter();

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const sessaoSalva = sessionStorage.getItem("healthlog-session");

        if (!sessaoSalva) {
          router.replace("/login");
          return;
        }

        const sessao = JSON.parse(sessaoSalva);

        if (!sessao.token) {
          router.replace("/login");
          return;
        }

        const resposta = await saudeApi.listar(sessao.token);

        setRegistros(Array.isArray(resposta) ? resposta : []);
      } catch (error) {
        setErro(error.message || "Não foi possível carregar os registros.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, [router]);

  const hoje = obterDataLocal();

  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 6);
  dataLimite.setHours(0, 0, 0, 0);

  const registrosHoje = registros.filter(
    (registro) => registro.data === hoje
  );

  const registrosSemana = registros.filter((registro) => {
    const data = interpretarData(registro.data);

    return data && data >= dataLimite && data <= new Date();
  });

  const consumoAgua = registrosHoje
    .filter((registro) => obterTipo(registro) === "agua")
    .reduce(
      (total, registro) =>
        total + Number(registro.quantidadeLitros || 0),
      0
    );

  const registrosSono = registrosSemana.filter(
    (registro) => obterTipo(registro) === "sono"
  );

  const mediaSono = registrosSono.length
    ? registrosSono.reduce(
        (total, registro) =>
          total + Number(registro.horasDormidas || 0),
        0
      ) / registrosSono.length
    : 0;

  const registrosExercicio = registrosSemana.filter(
    (registro) => obterTipo(registro) === "exercicio"
  );

  const minutosExercicio = registrosExercicio.reduce(
    (total, registro) => total + Number(registro.duracao || 0),
    0
  );

  const registrosRecentes = [...registros]
    .sort((a, b) => {
      const dataA = interpretarData(a.data)?.getTime() || 0;
      const dataB = interpretarData(b.data)?.getTime() || 0;
      return dataB - dataA;
    })
    .slice(0, 5);

  function nomeTipo(registro) {
    const tipo = obterTipo(registro);

    if (tipo === "agua") return "Consumo de água";
    if (tipo === "sono") return "Sono";
    if (tipo === "exercicio") return "Exercício";

    return registro.tipo || "Registro";
  }

  function descricaoRegistro(registro) {
    const tipo = obterTipo(registro);

    if (tipo === "agua") {
      return `${Number(registro.quantidadeLitros || 0).toLocaleString(
        "pt-BR"
      )} litros`;
    }

    if (tipo === "sono") {
      return `${registro.horasDormidas || 0} horas · ${
        registro.qualidadeSono || "Qualidade não informada"
      }`;
    }

    if (tipo === "exercicio") {
      return `${registro.tipoExercicio || "Atividade"} · ${
        registro.duracao || 0
      } minutos`;
    }

    return registro.observacoes || "Sem descrição";
  }

  return (
    <AppShell>
      <main className={styles.dashboard}>
        <header className={styles.cabecalho}>
          <div>
            <p className={styles.eyebrow}>VISÃO GERAL</p>
            <h1>Dashboard</h1>
            <p className={styles.subtitulo}>
              Acompanhe seus hábitos e consulte sua evolução em saúde.
            </p>
          </div>

          <div className={styles.dataAtual}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        {erro && (
          <div className={styles.erro}>
            {erro}
          </div>
        )}

        {carregando ? (
          <div className={styles.estado}>
            Carregando seus indicadores...
          </div>
        ) : (
          <>
            <section className={styles.indicadores}>
              <article className={styles.card}>
                <div className={styles.cardTopo}>
                  <span className={styles.icone}>💧</span>
                  <span className={styles.periodo}>Hoje</span>
                </div>
                <p className={styles.cardTitulo}>Consumo de água</p>
                <strong className={styles.valor}>
                  {consumoAgua.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                  })}
                  <small> L</small>
                </strong>
                <p className={styles.descricao}>
                  Total registrado hoje
                </p>
              </article>

              <article className={styles.card}>
                <div className={styles.cardTopo}>
                  <span className={styles.icone}>🌙</span>
                  <span className={styles.periodo}>7 dias</span>
                </div>
                <p className={styles.cardTitulo}>Média de sono</p>
                <strong className={styles.valor}>
                  {mediaSono.toLocaleString("pt-BR", {
                    maximumFractionDigits: 1,
                  })}
                  <small> h</small>
                </strong>
                <p className={styles.descricao}>
                  Média por registro de sono
                </p>
              </article>

              <article className={styles.card}>
                <div className={styles.cardTopo}>
                  <span className={styles.icone}>🏃</span>
                  <span className={styles.periodo}>7 dias</span>
                </div>
                <p className={styles.cardTitulo}>Exercícios</p>
                <strong className={styles.valor}>
                  {registrosExercicio.length}
                </strong>
                <p className={styles.descricao}>
                  Atividades registradas
                </p>
              </article>

              <article className={styles.card}>
                <div className={styles.cardTopo}>
                  <span className={styles.icone}>⏱️</span>
                  <span className={styles.periodo}>7 dias</span>
                </div>
                <p className={styles.cardTitulo}>Tempo de atividade</p>
                <strong className={styles.valor}>
                  {minutosExercicio}
                  <small> min</small>
                </strong>
                <p className={styles.descricao}>
                  Tempo total de exercícios
                </p>
              </article>
            </section>

            <section className={styles.conteudo}>
              <div className={styles.painel}>
                <div className={styles.painelCabecalho}>
                  <div>
                    <h2>Resumo da semana</h2>
                    <p>Seus registros dos últimos sete dias.</p>
                  </div>
                </div>

                <div className={styles.resumo}>
                  <div className={styles.resumoItem}>
                    <span>💧</span>
                    <div>
                      <strong>
                        {
                          registrosSemana.filter(
                            (r) => obterTipo(r) === "agua"
                          ).length
                        }
                      </strong>
                      <p>Registros de água</p>
                    </div>
                  </div>

                  <div className={styles.resumoItem}>
                    <span>🌙</span>
                    <div>
                      <strong>{registrosSono.length}</strong>
                      <p>Registros de sono</p>
                    </div>
                  </div>

                  <div className={styles.resumoItem}>
                    <span>🏃</span>
                    <div>
                      <strong>{registrosExercicio.length}</strong>
                      <p>Registros de exercício</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.painel}>
                <div className={styles.painelCabecalho}>
                  <div>
                    <h2>Registros recentes</h2>
                    <p>Seus últimos lançamentos no diário.</p>
                  </div>
                  <button
                    className={styles.botaoLink}
                    onClick={() => router.push("/diario")}
                  >
                    Ver diário →
                  </button>
                </div>

                {registrosRecentes.length === 0 ? (
                  <div className={styles.vazio}>
                    <span>📝</span>
                    <h3>Nenhum registro encontrado</h3>
                    <p>
                      Comece a registrar seus hábitos para acompanhar
                      sua evolução por aqui.
                    </p>
                    <button
                      className={styles.botaoPrincipal}
                      onClick={() => router.push("/diario")}
                    >
                      Fazer primeiro registro
                    </button>
                  </div>
                ) : (
                  <div className={styles.listaRegistros}>
                    {registrosRecentes.map((registro) => (
                      <div
                        className={styles.registro}
                        key={registro._id}
                      >
                        <div className={styles.registroInfo}>
                          <strong>{nomeTipo(registro)}</strong>
                          <span>{descricaoRegistro(registro)}</span>
                        </div>
                        <time>{formatarData(registro.data)}</time>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </AppShell>
  );
}

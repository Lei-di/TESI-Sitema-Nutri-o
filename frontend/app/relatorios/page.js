
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/app-shell";
import { saudeApi } from "../../lib/api";
import styles from "./relatorios.module.css";

function obterDataLocal(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function normalizarTipo(tipo) {
  const valor = String(tipo || "").toLowerCase();

  if (valor.includes("agua")) return "agua";
  if (valor.includes("sono")) return "sono";
  if (valor.includes("exercicio")) return "exercicio";

  return valor;
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

function obterPeriodo(periodo) {
  const hoje = new Date();
  const fim = obterDataLocal(hoje);
  let inicio;

  if (periodo === "semana") {
    const primeiroDia = new Date(hoje);
    primeiroDia.setDate(hoje.getDate() - 6);
    inicio = obterDataLocal(primeiroDia);
  } else {
    inicio = `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}-01`;
  }

  return { inicio, fim };
}

function criarDias(inicio, fim) {
  const dias = [];
  const atual = new Date(`${inicio}T12:00:00`);
  const limite = new Date(`${fim}T12:00:00`);

  while (atual <= limite) {
    dias.push(obterDataLocal(atual));
    atual.setDate(atual.getDate() + 1);
  }

  return dias;
}

export default function RelatoriosPage() {
  const router = useRouter();

  const [registros, setRegistros] = useState([]);
  const [periodo, setPeriodo] = useState("semana");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
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
        setErro(error.message || "Não foi possível carregar os relatórios.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [router]);

  const intervalo = obterPeriodo(periodo);

  const registrosPeriodo = registros.filter(
    (registro) =>
      registro.data >= intervalo.inicio &&
      registro.data <= intervalo.fim
  );

  const registrosAgua = registrosPeriodo.filter(
    (registro) => normalizarTipo(registro.tipo) === "agua"
  );

  const registrosSono = registrosPeriodo.filter(
    (registro) => normalizarTipo(registro.tipo) === "sono"
  );

  const registrosExercicio = registrosPeriodo.filter(
    (registro) => normalizarTipo(registro.tipo) === "exercicio"
  );

  const totalAgua = registrosAgua.reduce(
    (total, registro) =>
      total + Number(registro.quantidadeLitros || 0),
    0
  );

  const mediaAgua =
    totalAgua / (criarDias(intervalo.inicio, intervalo.fim).length || 1);

  const totalSono = registrosSono.reduce(
    (total, registro) =>
      total + Number(registro.horasDormidas || 0),
    0
  );

  const mediaSono =
    registrosSono.length > 0
      ? totalSono / registrosSono.length
      : 0;

  const totalMinutosExercicio = registrosExercicio.reduce(
    (total, registro) =>
      total + Number(registro.duracao || 0),
    0
  );

  const totalCalorias = registrosExercicio.reduce(
    (total, registro) =>
      total + Number(registro.calorias || 0),
    0
  );

  const dias = criarDias(intervalo.inicio, intervalo.fim);

  const dadosDiarios = dias.map((dia) => {
    const registrosDoDia = registrosPeriodo.filter(
      (registro) => registro.data === dia
    );

    const agua = registrosDoDia
      .filter((registro) => normalizarTipo(registro.tipo) === "agua")
      .reduce(
        (total, registro) =>
          total + Number(registro.quantidadeLitros || 0),
        0
      );

    const sonoRegistros = registrosDoDia.filter(
      (registro) => normalizarTipo(registro.tipo) === "sono"
    );

    const sono =
      sonoRegistros.length > 0
        ? sonoRegistros.reduce(
            (total, registro) =>
              total + Number(registro.horasDormidas || 0),
            0
          ) / sonoRegistros.length
        : 0;

    const exercicios = registrosDoDia.filter(
      (registro) => normalizarTipo(registro.tipo) === "exercicio"
    );

    const minutos = exercicios.reduce(
      (total, registro) =>
        total + Number(registro.duracao || 0),
      0
    );

    return {
      data: dia,
      agua,
      sono,
      minutos,
      quantidadeExercicios: exercicios.length,
    };
  });

  function formatarNumero(valor, casas = 1) {
    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: casas,
    });
  }

  function renderizarGrafico(titulo, unidade, campo, cor) {
    const maiorValor = Math.max(
      ...dadosDiarios.map((dia) => dia[campo]),
      1
    );

    return (
      <section className={styles.painel}>
        <div className={styles.tituloPainel}>
          <div>
            <h2>{titulo}</h2>
            <p>Valores registrados em cada dia do período.</p>
          </div>
          <span className={styles.unidade}>{unidade}</span>
        </div>

        {registrosPeriodo.length === 0 ? (
          <div className={styles.vazio}>
            Não há dados para apresentar neste período.
          </div>
        ) : (
          <div className={styles.grafico}>
            {dadosDiarios.map((dia) => {
              const valor = dia[campo];
              const altura =
                valor > 0 ? Math.max((valor / maiorValor) * 100, 4) : 0;

              return (
                <div className={styles.coluna} key={dia.data}>
                  <span className={styles.valorGrafico}>
                    {valor > 0 ? formatarNumero(valor) : ""}
                  </span>

                  <div className={styles.areaBarra}>
                    <div
                      className={styles.barra}
                      style={{
                        height: `${altura}%`,
                        backgroundColor: cor,
                      }}
                      title={`${formatarData(dia.data)}: ${formatarNumero(
                        valor
                      )} ${unidade}`}
                    />
                  </div>

                  <span className={styles.rotuloData}>
                    {formatarData(dia.data)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <AppShell>
      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <span className={styles.identificador}>
              ACOMPANHAMENTO PESSOAL
            </span>
            <h1>Relatórios</h1>
            <p>
              Acompanhe sua evolução e visualize seus hábitos de saúde.
            </p>
          </div>
        </header>

        <section className={styles.controles}>
          <div>
            <h2>Visão geral</h2>
            <p>Selecione o período que deseja consultar.</p>
          </div>

          <div className={styles.seletor}>
            <button
              type="button"
              className={
                periodo === "semana" ? styles.ativo : styles.opcao
              }
              onClick={() => setPeriodo("semana")}
            >
              Últimos 7 dias
            </button>

            <button
              type="button"
              className={
                periodo === "mes" ? styles.ativo : styles.opcao
              }
              onClick={() => setPeriodo("mes")}
            >
              Este mês
            </button>
          </div>
        </section>

        {erro && <div className={styles.erro}>{erro}</div>}

        {carregando ? (
          <div className={styles.estado}>Carregando relatórios...</div>
        ) : (
          <>
            <section className={styles.resumo}>
              <article className={styles.cardResumo}>
                <span>💧</span>
                <p>Água consumida</p>
                <strong>{formatarNumero(totalAgua)} L</strong>
                <small>Média diária: {formatarNumero(mediaAgua)} L</small>
              </article>

              <article className={styles.cardResumo}>
                <span>🌙</span>
                <p>Média de sono</p>
                <strong>{formatarNumero(mediaSono)} h</strong>
                <small>{registrosSono.length} registros de sono</small>
              </article>

              <article className={styles.cardResumo}>
                <span>🏃</span>
                <p>Exercícios realizados</p>
                <strong>{registrosExercicio.length}</strong>
                <small>
                  {totalMinutosExercicio} minutos de atividade
                </small>
              </article>

              <article className={styles.cardResumo}>
                <span>🔥</span>
                <p>Calorias gastas</p>
                <strong>{formatarNumero(totalCalorias, 0)}</strong>
                <small>kcal registradas</small>
              </article>
            </section>

            <div className={styles.graficos}>
              {renderizarGrafico(
                "Consumo de água",
                "L",
                "agua",
                "#65a982"
              )}

              {renderizarGrafico(
                "Horas de sono",
                "horas",
                "sono",
                "#8293c9"
              )}

              {renderizarGrafico(
                "Duração dos exercícios",
                "min",
                "minutos",
                "#d6a15c"
              )}
            </div>

            <section className={styles.painel}>
              <div className={styles.tituloPainel}>
                <div>
                  <h2>Resumo do período</h2>
                  <p>Quantidade de registros realizados.</p>
                </div>
              </div>

              <div className={styles.resumoRegistros}>
                <div>
                  <span>Registros de água</span>
                  <strong>{registrosAgua.length}</strong>
                </div>

                <div>
                  <span>Registros de sono</span>
                  <strong>{registrosSono.length}</strong>
                </div>

                <div>
                  <span>Registros de exercício</span>
                  <strong>{registrosExercicio.length}</strong>
                </div>

                <div>
                  <span>Total de registros</span>
                  <strong>{registrosPeriodo.length}</strong>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </AppShell>
  );
}

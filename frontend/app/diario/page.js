
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/app-shell";
import { saudeApi } from "../../lib/api";
import styles from "./diario.module.css";

function obterDataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
  if (!data) return "Data não informada";
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function normalizarTipo(tipo) {
  const valor = String(tipo || "").toLowerCase();
  if (valor.includes("agua")) return "agua";
  if (valor.includes("sono")) return "sono";
  if (valor.includes("exercicio")) return "exercicio";
  return valor;
}

function nomeTipo(tipo) {
  const nomes = {
    agua: "Água",
    sono: "Sono",
    exercicio: "Exercício",
  };
  return nomes[normalizarTipo(tipo)] || "Registro";
}

export default function DiarioPage() {
  const router = useRouter();

  const [registros, setRegistros] = useState([]);
  const [tipo, setTipo] = useState("agua");
  const [data, setData] = useState(obterDataLocal());
  const [quantidade, setQuantidade] = useState("");
  const [horasDormidas, setHorasDormidas] = useState("");
  const [qualidadeSono, setQualidadeSono] = useState("Boa");
  const [tipoExercicio, setTipoExercicio] = useState("");
  const [duracao, setDuracao] = useState("");
  const [calorias, setCalorias] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [filtroData, setFiltroData] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarRegistros() {
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

  useEffect(() => {
    carregarRegistros();
  }, []);

  function obterSessao() {
    const sessaoSalva = sessionStorage.getItem("healthlog-session");

    if (!sessaoSalva) {
      router.replace("/login");
      return null;
    }

    try {
      return JSON.parse(sessaoSalva);
    } catch {
      router.replace("/login");
      return null;
    }
  }

  function limparFormulario() {
    setTipo("agua");
    setData(obterDataLocal());
    setQuantidade("");
    setHorasDormidas("");
    setQualidadeSono("Boa");
    setTipoExercicio("");
    setDuracao("");
    setCalorias("");
    setObservacoes("");
    setEditando(null);
  }

  function montarDados() {
    const dados = {
      data,
      observacoes: observacoes.trim(),
    };

    if (tipo === "agua") {
      dados.quantidadeLitros = Number(quantidade);
    }

    if (tipo === "sono") {
      dados.horasDormidas = Number(horasDormidas);
      dados.qualidadeSono = qualidadeSono;
    }

    if (tipo === "exercicio") {
      dados.tipoExercicio = tipoExercicio.trim();
      dados.duracao = Number(duracao);
      dados.calorias = Number(calorias);
    }

    return dados;
  }

  function validarFormulario() {
    if (!data) return "Informe a data do registro.";

    if (tipo === "agua") {
      const valor = Number(quantidade);
      if (quantidade === "" || !Number.isFinite(valor) || valor <= 0) {
        return "Informe uma quantidade de água válida.";
      }
    }

    if (tipo === "sono") {
      const horas = Number(horasDormidas);
      if (
        horasDormidas === "" ||
        !Number.isFinite(horas) ||
        horas < 0 ||
        horas > 24
      ) {
        return "Informe uma quantidade de horas entre 0 e 24.";
      }

      if (!qualidadeSono) return "Selecione a qualidade do sono.";
    }

    if (tipo === "exercicio") {
      const minutos = Number(duracao);
      const caloriasValor = Number(calorias);

      if (!tipoExercicio.trim()) {
        return "Informe o tipo de exercício.";
      }

      if (
        duracao === "" ||
        !Number.isFinite(minutos) ||
        minutos <= 0
      ) {
        return "Informe uma duração válida em minutos.";
      }

      if (
        calorias === "" ||
        !Number.isFinite(caloriasValor) ||
        caloriasValor < 0
      ) {
        return "Informe uma quantidade válida de calorias.";
      }
    }

    return "";
  }

  async function salvarRegistro(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    const erroValidacao = validarFormulario();

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const sessao = obterSessao();
    if (!sessao?.token) return;

    const dados = montarDados();
    setSalvando(true);

    try {
      if (editando) {
        await saudeApi.atualizar(editando, dados, sessao.token);
        setMensagem("Registro atualizado com sucesso!");
      } else {
        await saudeApi.criar(
          { ...dados, tipo },
          sessao.token
        );
        setMensagem(`${nomeTipo(tipo)} registrado com sucesso!`);
      }

      limparFormulario();
      await carregarRegistros();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar o registro.");
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(registro) {
    const tipoRegistro = normalizarTipo(registro.tipo);

    setTipo(tipoRegistro);
    setEditando(registro._id);
    setData(registro.data || obterDataLocal());
    setObservacoes(registro.observacoes || "");

    setQuantidade(
      registro.quantidadeLitros != null
        ? String(registro.quantidadeLitros)
        : ""
    );

    setHorasDormidas(
      registro.horasDormidas != null
        ? String(registro.horasDormidas)
        : ""
    );

    setQualidadeSono(registro.qualidadeSono || "Boa");
    setTipoExercicio(registro.tipoExercicio || "");

    setDuracao(
      registro.duracao != null ? String(registro.duracao) : ""
    );

    setCalorias(
      registro.calorias != null ? String(registro.calorias) : ""
    );

    setErro("");
    setMensagem("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirRegistro(id) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este registro?"
    );

    if (!confirmar) return;

    const sessao = obterSessao();
    if (!sessao?.token) return;

    setErro("");
    setMensagem("");

    try {
      await saudeApi.excluir(id, sessao.token);

      setRegistros((atuais) =>
        atuais.filter((registro) => registro._id !== id)
      );

      if (editando === id) limparFormulario();

      setMensagem("Registro excluído com sucesso!");
    } catch (error) {
      setErro(error.message || "Não foi possível excluir o registro.");
    }
  }

  const registrosFiltrados = registros
    .filter((registro) =>
      filtroData ? registro.data === filtroData : true
    )
    .filter((registro) =>
      filtroTipo === "todos"
        ? true
        : normalizarTipo(registro.tipo) === filtroTipo
    )
    .sort((a, b) =>
      String(b.data || "").localeCompare(String(a.data || ""))
    );

  const hoje = obterDataLocal();

  const registrosAguaHoje = registros
    .filter((registro) => normalizarTipo(registro.tipo) === "agua")
    .filter((registro) => registro.data === hoje);

  const totalAguaHoje = registrosAguaHoje.reduce(
    (total, registro) =>
      total + Number(registro.quantidadeLitros || 0),
    0
  );

  const registrosSono = registros.filter(
    (registro) => normalizarTipo(registro.tipo) === "sono"
  );

  const mediaSono =
    registrosSono.length > 0
      ? registrosSono.reduce(
          (total, registro) =>
            total + Number(registro.horasDormidas || 0),
          0
        ) / registrosSono.length
      : 0;

  const totalExercicios = registros.filter(
    (registro) => normalizarTipo(registro.tipo) === "exercicio"
  ).length;

  function descricaoRegistro(registro) {
    const tipoRegistro = normalizarTipo(registro.tipo);

    if (tipoRegistro === "agua") {
      return `${Number(registro.quantidadeLitros || 0).toLocaleString(
        "pt-BR",
        { maximumFractionDigits: 2 }
      )} litros de água`;
    }

    if (tipoRegistro === "sono") {
      return `${registro.horasDormidas ?? 0} horas de sono · Qualidade: ${
        registro.qualidadeSono || "Não informada"
      }`;
    }

    if (tipoRegistro === "exercicio") {
      return `${registro.tipoExercicio || "Exercício"} · ${
        registro.duracao ?? 0
      } minutos · ${registro.calorias ?? 0} kcal`;
    }

    return "Registro de saúde";
  }

  function iconeRegistro(registro) {
    const tipoRegistro = normalizarTipo(registro.tipo);
    if (tipoRegistro === "agua") return "💧";
    if (tipoRegistro === "sono") return "🌙";
    if (tipoRegistro === "exercicio") return "🏃";
    return "📋";
  }

  return (
    <AppShell>
      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <span className={styles.identificador}>
              ACOMPANHAMENTO PESSOAL
            </span>
            <h1>Meu diário</h1>
            <p>
              Registre seus hábitos e acompanhe sua rotina de saúde.
            </p>
          </div>
        </header>

        <section className={styles.indicadores}>
          <article className={styles.indicador}>
            <span className={styles.icone}>💧</span>
            <div>
              <p>Água consumida hoje</p>
              <strong>
                {totalAguaHoje.toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                })} L
              </strong>
            </div>
          </article>

          <article className={styles.indicador}>
            <span className={styles.icone}>🌙</span>
            <div>
              <p>Média de horas de sono</p>
              <strong>
                {mediaSono.toLocaleString("pt-BR", {
                  maximumFractionDigits: 1,
                })} h
              </strong>
            </div>
          </article>

          <article className={styles.indicador}>
            <span className={styles.icone}>🏃</span>
            <div>
              <p>Total de exercícios</p>
              <strong>{totalExercicios}</strong>
            </div>
          </article>
        </section>

        <section className={styles.painel}>
          <div className={styles.tituloPainel}>
            <div>
              <h2>{editando ? "Editar registro" : "Novo registro"}</h2>
              <p>Selecione o hábito que deseja registrar.</p>
            </div>
            <span className={styles.iconeGrande}>📝</span>
          </div>

          <div className={styles.seletorTipos}>
            <button
              type="button"
              className={tipo === "agua" ? styles.tipoAtivo : styles.tipoBotao}
              onClick={() => {
                if (!editando) setTipo("agua");
              }}
              disabled={Boolean(editando)}
            >
              💧 Água
            </button>

            <button
              type="button"
              className={tipo === "sono" ? styles.tipoAtivo : styles.tipoBotao}
              onClick={() => {
                if (!editando) setTipo("sono");
              }}
              disabled={Boolean(editando)}
            >
              🌙 Sono
            </button>

            <button
              type="button"
              className={
                tipo === "exercicio" ? styles.tipoAtivo : styles.tipoBotao
              }
              onClick={() => {
                if (!editando) setTipo("exercicio");
              }}
              disabled={Boolean(editando)}
            >
              🏃 Exercício
            </button>
          </div>

          {erro && <div className={styles.erro}>{erro}</div>}
          {mensagem && <div className={styles.sucesso}>{mensagem}</div>}

          <form className={styles.formulario} onSubmit={salvarRegistro}>
            <div className={styles.campos}>
              <label>
                Data
                <input
                  type="date"
                  value={data}
                  onChange={(event) => setData(event.target.value)}
                  required
                />
              </label>

              {tipo === "agua" && (
                <label>
                  Quantidade de água (litros)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Ex.: 0.5"
                    value={quantidade}
                    onChange={(event) => setQuantidade(event.target.value)}
                    required
                  />
                </label>
              )}

              {tipo === "sono" && (
                <>
                  <label>
                    Horas dormidas
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="Ex.: 8"
                      value={horasDormidas}
                      onChange={(event) =>
                        setHorasDormidas(event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Qualidade do sono
                    <select
                      value={qualidadeSono}
                      onChange={(event) =>
                        setQualidadeSono(event.target.value)
                      }
                      required
                    >
                      <option value="Boa">Boa</option>
                      <option value="Regular">Regular</option>
                      <option value="Ruim">Ruim</option>
                    </select>
                  </label>
                </>
              )}

              {tipo === "exercicio" && (
                <>
                  <label>
                    Tipo de exercício
                    <input
                      type="text"
                      placeholder="Ex.: Caminhada, musculação..."
                      value={tipoExercicio}
                      onChange={(event) =>
                        setTipoExercicio(event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Duração (minutos)
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Ex.: 40"
                      value={duracao}
                      onChange={(event) => setDuracao(event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Calorias gastas (kcal)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Ex.: 200"
                      value={calorias}
                      onChange={(event) => setCalorias(event.target.value)}
                      required
                    />
                  </label>
                </>
              )}
            </div>

            <label>
              Observações (opcional)
              <textarea
                rows="3"
                placeholder="Adicione alguma observação..."
                value={observacoes}
                onChange={(event) => setObservacoes(event.target.value)}
              />
            </label>

            <div className={styles.acoesFormulario}>
              {editando && (
                <button
                  type="button"
                  className={styles.botaoCancelar}
                  onClick={limparFormulario}
                >
                  Cancelar edição
                </button>
              )}

              <button
                type="submit"
                className={styles.botaoSalvar}
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : editando
                    ? "Salvar alterações"
                    : "Registrar"}
              </button>
            </div>
          </form>
        </section>

        <section className={styles.painel}>
          <div className={styles.tituloHistorico}>
            <div>
              <h2>Histórico de registros</h2>
              <p>Consulte e gerencie seus registros de saúde.</p>
            </div>

            <div className={styles.filtros}>
              <label className={styles.filtro}>
                Filtrar por data
                <input
                  type="date"
                  value={filtroData}
                  onChange={(event) => setFiltroData(event.target.value)}
                />
              </label>

              <label className={styles.filtro}>
                Tipo de registro
                <select
                  value={filtroTipo}
                  onChange={(event) => setFiltroTipo(event.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="agua">Água</option>
                  <option value="sono">Sono</option>
                  <option value="exercicio">Exercício</option>
                </select>
              </label>
            </div>
          </div>

          {carregando ? (
            <div className={styles.estado}>Carregando registros...</div>
          ) : registrosFiltrados.length === 0 ? (
            <div className={styles.vazio}>
              <span>📋</span>
              <h3>Nenhum registro encontrado</h3>
              <p>
                {filtroData || filtroTipo !== "todos"
                  ? "Não há registros com os filtros selecionados."
                  : "Seus registros aparecerão aqui."}
              </p>
            </div>
          ) : (
            <div className={styles.lista}>
              {registrosFiltrados.map((registro) => (
                <article className={styles.registro} key={registro._id}>
                  <div className={styles.registroIcone}>
                    {iconeRegistro(registro)}
                  </div>

                  <div className={styles.registroInfo}>
                    <strong>{descricaoRegistro(registro)}</strong>
                    <span>
                      {nomeTipo(registro.tipo)} · {formatarData(registro.data)}
                    </span>
                    {registro.observacoes && (
                      <p>{registro.observacoes}</p>
                    )}
                  </div>

                  <div className={styles.acoesRegistro}>
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(registro)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={styles.excluir}
                      onClick={() => excluirRegistro(registro._id)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}

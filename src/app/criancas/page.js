"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { API_BASE_URL } from "../../lib/api";
import ContagemCriancasPDF from "../../../components/pdf/contagemCriancasPDF";
import styles from "./page.module.css";

const TOTAL_SALAS = 13;

function getDataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function criarContagensVazias() {
  return {
    manha: Array(TOTAL_SALAS).fill(""),
    tarde: Array(TOTAL_SALAS).fill(""),
  };
}

function normalizarContagens(dados) {
  return {
    manha: dados.manha.map((quantidade) => quantidade ?? ""),
    tarde: dados.tarde.map((quantidade) => quantidade ?? ""),
  };
}

export default function CriancasPage() {
  const [escolaId, setEscolaId] = useState("");
  const [data, setData] = useState("");
  const [contagens, setContagens] = useState(criarContagensVazias);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [erroLista, setErroLista] = useState("");
  const [atualizacaoLista, setAtualizacaoLista] = useState(0);
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);
  const [exportandoPDF, setExportandoPDF] = useState(false);
  const [erroExportacao, setErroExportacao] = useState("");
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    setEscolaId(localStorage.getItem("escola_id") || "");
    setData(getDataLocal());
  }, []);

  useEffect(() => {
    if (!escolaId || !data) return;

    let cancelado = false;

    async function carregarContagens() {
      setCarregando(true);
      setMensagem(null);
      setContagens(criarContagensVazias());

      try {
        const response = await axios.get(`${API_BASE_URL}/criancas`, {
          params: { escola_id: escolaId, data },
        });

        if (!cancelado) {
          setContagens(normalizarContagens(response.data.dados));
        }
      } catch (error) {
        if (!cancelado) {
          console.error("Erro ao carregar quantidades de crianças:", error);
          setMensagem({
            tipo: "erro",
            texto: "Não foi possível carregar os registros desta data.",
          });
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarContagens();

    return () => {
      cancelado = true;
    };
  }, [escolaId, data]);

  useEffect(() => {
    if (!escolaId || !mostrarLista) return;

    let cancelado = false;

    async function carregarLista() {
      setCarregandoLista(true);
      setErroLista("");

      try {
        const response = await axios.get(`${API_BASE_URL}/criancas/lista`, {
          params: { escola_id: escolaId },
        });

        if (!cancelado) setRegistros(response.data.dados);
      } catch (error) {
        if (!cancelado) {
          console.error("Erro ao carregar lista de registros:", error);
          setErroLista(
            error.response?.status === 404
              ? "A API em execução ainda não reconhece a lista de registros. Reinicie a API ou atualize o aplicativo."
              : error.response?.data?.message || "Não foi possível carregar os registros salvos."
          );
        }
      } finally {
        if (!cancelado) setCarregandoLista(false);
      }
    }

    carregarLista();

    return () => {
      cancelado = true;
    };
  }, [escolaId, mostrarLista, atualizacaoLista]);

  function alterarContagem(periodo, indice, valor) {
    setContagens((atual) => ({
      ...atual,
      [periodo]: atual[periodo].map((quantidade, posicao) =>
        posicao === indice ? valor : quantidade
      ),
    }));
    setMensagem(null);
  }

  async function salvarContagens(event) {
    event.preventDefault();
    setMensagem(null);
    setSalvando(true);

    try {
      const converterContagens = (periodo) =>
        contagens[periodo].map((quantidade) =>
          quantidade === "" ? null : Number(quantidade)
        );

      await axios.put(`${API_BASE_URL}/criancas`, {
        escola_id: escolaId,
        data,
        manha: converterContagens("manha"),
        tarde: converterContagens("tarde"),
      });

      setAtualizacaoLista((atualizacao) => atualizacao + 1);
      setMensagem({
        tipo: "sucesso",
        texto: "Quantidades salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar quantidades de crianças:", error);
      setMensagem({
        tipo: "erro",
        texto:
          error.response?.status === 404
            ? "A API em execução ainda não reconhece o salvamento de crianças. Reinicie a API ou atualize o aplicativo."
            : error.response?.data?.message || "Não foi possível salvar os registros.",
      });
    } finally {
      setSalvando(false);
    }
  }

  function chaveData(registro) {
    return String(registro.data).slice(0, 10);
  }

  function alternarDataSelecionada(dataRegistro) {
    setDatasSelecionadas((selecionadas) =>
      selecionadas.includes(dataRegistro)
        ? selecionadas.filter((dataSelecionada) => dataSelecionada !== dataRegistro)
        : [...selecionadas, dataRegistro]
    );
    setErroExportacao("");
  }

  function alternarTodasAsDatas() {
    if (datasSelecionadas.length === registros.length) {
      setDatasSelecionadas([]);
    } else {
      setDatasSelecionadas(registros.map(chaveData));
    }
    setErroExportacao("");
  }

  async function exportarPDF() {
    if (datasSelecionadas.length === 0) return;

    setExportandoPDF(true);
    setErroExportacao("");

    try {
      const detalhes = await Promise.all(
        datasSelecionadas.map(async (dataRegistro) => {
          const response = await axios.get(`${API_BASE_URL}/criancas`, {
            params: { escola_id: escolaId, data: dataRegistro },
          });
          return {
            data: dataRegistro,
            manha: response.data.dados.manha,
            tarde: response.data.dados.tarde,
          };
        })
      );

      detalhes.sort((a, b) => a.data.localeCompare(b.data));
      const arquivo = await pdf(<ContagemCriancasPDF registros={detalhes} />).toBlob();
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        detalhes.length === 1
          ? `quantidade-criancas-${detalhes[0].data}.pdf`
          : `quantidade-criancas-${detalhes.length}-datas.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Erro ao gerar PDF das quantidades:", error);
      setErroExportacao(
        error.response?.status === 404
          ? "A API em execução ainda não disponibiliza os registros para exportação. Reinicie a API ou atualize o aplicativo."
          : "Não foi possível gerar o PDF. Tente novamente."
      );
    } finally {
      setExportandoPDF(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/menu" className={styles.backLink}>
          Voltar ao menu
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Registro diário</p>
          <h1>Quantidade de crianças</h1>
          <p>Informe o total por sala nos períodos da manhã e da tarde.</p>
        </header>

        <form className={styles.form} onSubmit={salvarContagens}>
          <div className={styles.dateField}>
            <label htmlFor="data-contagem">Data</label>
            <input
              id="data-contagem"
              type="date"
              value={data}
              onChange={(event) => setData(event.target.value)}
              required
            />
          </div>

          <p className={styles.hint}>
            Os campos são opcionais. Deixe em branco quando não quiser informar um valor.
          </p>

          <div className={styles.tableWrap} aria-busy={carregando}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Sala</th>
                  <th scope="col">Manhã</th>
                  <th scope="col">Tarde</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: TOTAL_SALAS }, (_, indice) => (
                  <tr key={indice}>
                    <th scope="row">Sala {indice + 1}</th>
                    {["manha", "tarde"].map((periodo) => (
                      <td key={periodo}>
                        <label className={styles.visuallyHidden} htmlFor={`${periodo}-${indice}`}>
                          Quantidade de crianças na sala {indice + 1}, período{" "}
                          {periodo === "manha" ? "da manhã" : "da tarde"}
                        </label>
                        <input
                          id={`${periodo}-${indice}`}
                          type="number"
                          min="0"
                          max="4294967295"
                          step="1"
                          inputMode="numeric"
                          placeholder="—"
                          value={contagens[periodo][indice]}
                          onChange={(event) =>
                            alterarContagem(periodo, indice, event.target.value)
                          }
                          disabled={carregando || salvando}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mensagem && (
            <p
              className={`${styles.message} ${
                mensagem.tipo === "erro" ? styles.error : styles.success
              }`}
              role={mensagem.tipo === "erro" ? "alert" : "status"}
            >
              {mensagem.texto}
            </p>
          )}

          <button
            className={styles.saveButton}
            type="submit"
            disabled={carregando || salvando || !escolaId || !data}
          >
            {carregando ? "Carregando..." : salvando ? "Salvando..." : "Salvar quantidades"}
          </button>
        </form>

        <section className={styles.savedRecords} aria-labelledby="registros-title">
          <div className={styles.listHeader}>
            <div>
              <h2 id="registros-title">Registros salvos</h2>
              <p>Consulte as quantidades registradas em outras datas.</p>
            </div>
            <button
              className={styles.listToggle}
              type="button"
              onClick={() => setMostrarLista((mostrar) => !mostrar)}
              disabled={!escolaId}
              aria-expanded={mostrarLista}
              aria-controls="lista-registros"
            >
              {mostrarLista ? "Ocultar registros" : "Ver registros"}
            </button>
          </div>

          {mostrarLista && (
            <div id="lista-registros" className={styles.listContent}>
              {carregandoLista ? (
                <p className={styles.listMessage} role="status">Carregando registros...</p>
              ) : erroLista ? (
                <p className={`${styles.listMessage} ${styles.error}`} role="alert">
                  {erroLista}
                </p>
              ) : registros.length === 0 ? (
                <p className={styles.listMessage}>Ainda não há registros salvos.</p>
              ) : (
                <>
                  <div className={styles.exportToolbar}>
                    <label className={styles.selectAll}>
                      <input
                        type="checkbox"
                        checked={
                          registros.length > 0 &&
                          datasSelecionadas.length === registros.length
                        }
                        onChange={alternarTodasAsDatas}
                        aria-label="Selecionar todas as datas"
                      />
                      Selecionar todas
                    </label>
                    <button
                      className={styles.exportButton}
                      type="button"
                      onClick={exportarPDF}
                      disabled={datasSelecionadas.length === 0 || exportandoPDF}
                    >
                      {exportandoPDF
                        ? "Gerando PDF..."
                        : datasSelecionadas.length === 0
                          ? "Selecione datas para o PDF"
                          : `Salvar ${datasSelecionadas.length} ${
                              datasSelecionadas.length === 1 ? "data" : "datas"
                            } em PDF`}
                    </button>
                  </div>

                  {erroExportacao && (
                    <p className={`${styles.listMessage} ${styles.error}`} role="alert">
                      {erroExportacao}
                    </p>
                  )}

                  <div className={styles.tableWrap}>
                    <table className={styles.savedTable}>
                      <thead>
                        <tr>
                          <th scope="col">Selecionar</th>
                          <th scope="col">Data</th>
                          <th scope="col">Manhã</th>
                          <th scope="col">Tarde</th>
                          <th scope="col">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registros.map((registro) => {
                          const dataRegistro = chaveData(registro);
                          return (
                            <tr key={dataRegistro}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={datasSelecionadas.includes(dataRegistro)}
                                  onChange={() => alternarDataSelecionada(dataRegistro)}
                                  aria-label={`Selecionar registro de ${new Date(`${dataRegistro}T12:00:00`).toLocaleDateString("pt-BR")}`}
                                />
                              </td>
                              <th scope="row">
                                {new Date(`${dataRegistro}T12:00:00`).toLocaleDateString("pt-BR")}
                              </th>
                              <td>
                                {registro.total_manha ?? 0} crianças
                                <span className={styles.roomsCount}>
                                  {` (${registro.salas_manha}/13 salas)`}
                                </span>
                              </td>
                              <td>
                                {registro.total_tarde ?? 0} crianças
                                <span className={styles.roomsCount}>
                                  {` (${registro.salas_tarde}/13 salas)`}
                                </span>
                              </td>
                              <td>
                                <button
                                  className={styles.viewButton}
                                  type="button"
                                  onClick={() => {
                                    setData(dataRegistro);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                >
                                  Ver lista
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

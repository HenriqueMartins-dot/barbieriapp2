"use client"

import { useEffect, useState } from "react"

export default function ListaFuncionarios() {

  const [funcionarios, setFuncionarios] = useState([])
  const [selecionados, setSelecionados] = useState([])

  const [filtros, setFiltros] = useState({
    nome: "",
    posicao: "",
    data: ""
  })

  useEffect(() => {
    carregarFuncionarios()
  }, [])

  function formatarHora(hora) {
    if (!hora) return "-"
    return hora.slice(0,5)
  }

  function formatarData(data) {
    if (!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR")
  }

  function formatarHoraData(data) {
    if (!data) return "-"
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  function toggleSelecionado(id) {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((s) => s !== id))
    } else {
      setSelecionados([...selecionados, id])
    }
  }

  function selecionarTodos() {
    const todosIds = funcionariosFiltrados.map((f) => f.id)

    if (selecionados.length === todosIds.length) {
      setSelecionados([])
    } else {
      setSelecionados(todosIds)
    }
  }

function imprimirSelecionados() {

  if (selecionados.length === 0) {
    alert("Selecione pelo menos um funcionário")
    return
  }

  const conteudo = document.getElementById("area-impressao").innerHTML

  const janela = window.open("", "", "width=800,height=600")

  janela.document.write(`
    <html>
      <head>
        <title>Impressão</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }

          th {
            background: #eee;
          }
        </style>
      </head>
      <body>
        <h2>Relatório de Funcionários</h2>
        ${conteudo}
      </body>
    </html>
  `)

  janela.document.close()
  janela.focus()

  setTimeout(() => {
    janela.print()
    janela.close()
  }, 500)
}
  async function atualizarObservacao(id, observacao) {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funcionarios/observacao/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ observacao })
        }
      )

      carregarFuncionarios()

    } catch (erro) {
      console.error("Erro ao atualizar observação:", erro)
    }
  }

  async function carregarFuncionarios() {
    const escola_id = localStorage.getItem("escola_id")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funcionarios?escola_id=${escola_id}`
      )

      const data = await res.json()
      setFuncionarios(data.dados)

    } catch (erro) {
      console.error("Erro ao carregar funcionários:", erro)
    }
  }

  async function apagarFuncionario(id) {
    const confirmar = confirm("Deseja apagar este registro?")
    if (!confirmar) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcionarios/${id}`, {
        method: "DELETE"
      })

      carregarFuncionarios()

    } catch (erro) {
      console.error("Erro ao apagar:", erro)
    }
  }

  function handleFiltroChange(e) {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    })
  }

  // ✅ FILTRO CORRIGIDO
  const funcionariosFiltrados = funcionarios.filter((f) => {

  const nomeOk = filtros.nome
    ? f.nome.toLowerCase().includes(filtros.nome.toLowerCase())
    : true

  const posicaoOk = filtros.posicao
    ? (f.posicao || "").toLowerCase().includes(filtros.posicao.toLowerCase())
    : true

  const dataOk = filtros.data
    ? new Date(f.data_registro).toISOString().slice(0,10) === filtros.data
    : true

  const algumFiltro = filtros.nome || filtros.posicao || filtros.data

  return algumFiltro && nomeOk && posicaoOk && dataOk
})

  // ✅ SOMENTE OS SELECIONADOS
  const funcionariosParaImpressao =
    selecionados.length > 0
      ? funcionariosFiltrados.filter((f) => selecionados.includes(f.id))
      : funcionariosFiltrados

  return (
    <div style={{ padding: "20px" }}>

      <h1>Lista de Funcionários</h1>

      <div className="no-print">

        <button onClick={selecionarTodos} style={{ marginRight: 10 }}>
          Selecionar Todos
        </button>

        <button onClick={imprimirSelecionados}>
          Imprimir Selecionados
        </button>

        <div style={{ marginTop: 20 }}>

          <input
            type="text"
            name="nome"
            placeholder="Filtrar por nome"
            value={filtros.nome}
            onChange={handleFiltroChange}
            style={{ marginRight: 10 }}
          />

          <input
            type="text"
            name="posicao"
            placeholder="Filtrar por posição"
            value={filtros.posicao}
            onChange={handleFiltroChange}
            style={{ marginRight: 10 }}
          />

          <input
            type="date"
            name="data"
            value={filtros.data}
            onChange={handleFiltroChange}
          />

        </div>

      </div>

      {/* ✅ ÁREA DE IMPRESSÃO */}
      <div id="area-impressao">

        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th className="no-print"></th>
              <th>Funcionário</th>
              <th>Posição</th>
              <th>Chegada</th>
              <th>Saída Almoço</th>
              <th>Retorno Almoço</th>
              <th>Saída</th>
              <th>Data</th>
              <th>Hora Registro</th>
              <th>Observação</th>
              <th className="no-print">Ação</th>
            </tr>
          </thead>

          <tbody>

            {funcionariosParaImpressao.map((f) => (

              <tr key={f.id}>

                <td className="no-print">
                  <input
                    type="checkbox"
                    checked={selecionados.includes(f.id)}
                    onChange={() => toggleSelecionado(f.id)}
                  />
                </td>

                <td>{f.nome}</td>
                <td>{f.posicao || "-"}</td>

                <td>{formatarHora(f.chegada)}</td>
                <td>{formatarHora(f.almoco_saida)}</td>
                <td>{formatarHora(f.almoco_retorno)}</td>
                <td>{formatarHora(f.saida)}</td>

                <td>{formatarData(f.data_registro)}</td>
                <td>{formatarHoraData(f.data_registro)}</td>

                <td>
                  <input
                    defaultValue={f.observacao || ""}
                    onBlur={(e) => atualizarObservacao(f.id, e.target.value)}
                  />
                </td>

                <td className="no-print">
                  <button onClick={() => apagarFuncionario(f.id)}>
                    Apagar
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}
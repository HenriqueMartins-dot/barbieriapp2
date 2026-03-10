"use client"

import { useEffect, useState } from "react"

export default function ListaFuncionarios() {

  const [funcionarios, setFuncionarios] = useState([])

  const [filtros, setFiltros] = useState({
    nome: "",
    posicao: ""
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

const funcionariosFiltrados = funcionarios.filter((f) => {

  const nomeOk = filtros.nome
    ? f.nome.toLowerCase().includes(filtros.nome.toLowerCase())
    : true

  const posicaoOk = filtros.posicao
    ? (f.posicao || "").toLowerCase().includes(filtros.posicao.toLowerCase())
    : true

  const algumFiltro = filtros.nome || filtros.posicao

  return algumFiltro && nomeOk && posicaoOk
})
  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Funcionários</h1>

      <div style={{ marginBottom: 20 }}>

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
        />

      </div>

      <table border="1" cellPadding="10">

        <thead>
          <tr>

            <th>Funcionário</th>
            <th>Posição</th>

            <th>Chegada</th>
            <th>Saída Almoço</th>
            <th>Retorno Almoço</th>
            <th>Saída</th>

            <th>Data</th>
            <th>Hora Registro</th>

            <th>Ação</th>

          </tr>
        </thead>

        <tbody>

          {funcionariosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="9">Digite algo no filtro para buscar</td>
            </tr>
          ) : (

            funcionariosFiltrados.map((f) => (

              <tr key={f.id}>

                <td>{f.nome}</td>
                <td>{f.posicao || "-"}</td>

                <td>{formatarHora(f.chegada)}</td>
                <td>{formatarHora(f.almoco_saida)}</td>
                <td>{formatarHora(f.almoco_retorno)}</td>
                <td>{formatarHora(f.saida)}</td>

                <td>{formatarData(f.data_registro)}</td>
                <td>{formatarHoraData(f.data_registro)}</td>

                <td>
                  <button onClick={() => apagarFuncionario(f.id)}>
                    Apagar
                  </button>
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  )
}
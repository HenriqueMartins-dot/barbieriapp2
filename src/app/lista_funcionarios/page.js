"use client"

import { useEffect, useState } from "react"

export default function ListaFuncionarios() {

  const [funcionarios, setFuncionarios] = useState([])

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Funcionários</h1>

      <table border="1" cellPadding="10">
<thead>
<tr>
  <th>Funcionário</th>
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
          {funcionarios.length === 0 ? (
            <tr>
              <td colSpan="7">Nenhum registro encontrado</td>
            </tr>
          ) : (
            funcionarios.map((f) => (
              <tr key={f.id}>
  <td>{f.nome}</td>
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
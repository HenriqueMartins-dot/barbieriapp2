"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";

export default function FuncionariosPage() {

  const [nome, setNome] = useState("");
  const [posicao, setPosicao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [acesso, setAcesso] = useState("");

  useEffect(() => {
    setAcesso(localStorage.getItem("acesso") || "");
  }, []);

  async function registrarPonto(tipo) {

    if (!nome) {
      alert("Digite o nome do funcionário");
      return;
    }

    if (!posicao) {
      alert("Digite a posição do funcionário");
      return;
    }

    try {

      const escola_id = localStorage.getItem("escola_id");

      const payload = {
        nome,
        posicao,
        observacao: acesso === "secretaria" ? observacao : null,
        tipo,
        escola_id
      };

      await axios.post(`${API_BASE_URL}/funcionarios/ponto`, payload);

      alert("Ponto registrado!");

    } catch (error) {
      console.error(error);
      alert("Erro ao registrar ponto.");
    }
  }

  async function atualizarObservacao(id, observacao) {

    try {

      await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ observacao })
      })

    } catch (erro) {
      console.error("Erro ao atualizar observação:", erro)
    }

  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Registro de Ponto</h2>

      <label>
        Nome:<br />
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome"
        />
      </label>

      <br /><br />

      <label>
        Posição:<br />
        <input
          value={posicao}
          onChange={(e) => setPosicao(e.target.value)}
        />
      </label>

      <br /><br />

      {acesso === "secretaria" && (
        <>
          <label>
            Observação:<br />
            <input
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite uma observação"
            />
          </label>

          <br /><br />
        </>
      )}

      <button onClick={() => registrarPonto("chegada")}>
        Registrar Chegada
      </button>

      <br /><br />

      <button onClick={() => registrarPonto("almoco_saida")}>
        Saída para almoço
      </button>

      <br /><br />

      <button onClick={() => registrarPonto("almoco_retorno")}>
        Retorno do almoço
      </button>

      <br /><br />

      <button onClick={() => registrarPonto("saida")}>
        Registrar Saída
      </button>

    </div>
  );
}
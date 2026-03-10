"use client";

import { useState } from "react";
import axios from "axios";

export default function FuncionariosPage() {

  const [nome, setNome] = useState("");
  const [posicao, setPosicao] = useState("");

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

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/funcionarios/ponto`,
        {
          nome,
          posicao,
          tipo,
          escola_id
        }
      );

      alert("Ponto registrado!");

    } catch (error) {
      console.error(error);
      alert("Erro ao registrar ponto.");
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
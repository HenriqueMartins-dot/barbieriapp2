"use client";

import { useState } from "react";
import axios from "axios";

export default function FuncionariosPage() {

  const [form, setForm] = useState({
    nome: '',
    chegada: '',
    almoco_saida: '',
    almoco_retorno: '',
    saida: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const escola_id = localStorage.getItem("escola_id");

      // substitui strings vazias por null, se quiser
      const payload = {
        ...form,
        escola_id,
        chegada: form.chegada || null,
        almoco_saida: form.almoco_saida || null,
        almoco_retorno: form.almoco_retorno || null,
        saida: form.saida || null
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/funcionarios`, payload);

      alert("Registro salvo!");

      setForm({
        nome: "",
        chegada: "",
        almoco_saida: "",
        almoco_retorno: "",
        saida: ""
      });

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar registro.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Registro de Funcionários</h2>

      <form onSubmit={handleSubmit}>

        <label>Nome:<br />
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Digite o nome (opcional)"
          />
        </label><br /><br />

        <label>Chegada:<br />
          <input
            type="time"
            name="chegada"
            value={form.chegada}
            onChange={handleChange}
          />
        </label><br /><br />

        <label>Saída para almoço:<br />
          <input
            type="time"
            name="almoco_saida"
            value={form.almoco_saida}
            onChange={handleChange}
          />
        </label><br /><br />

        <label>Retorno do almoço:<br />
          <input
            type="time"
            name="almoco_retorno"
            value={form.almoco_retorno}
            onChange={handleChange}
          />
        </label><br /><br />

        <label>Saída:<br />
          <input
            type="time"
            name="saida"
            value={form.saida}
            onChange={handleChange}
          />
        </label><br /><br />

        <button type="submit">Salvar Registro</button>

      </form>
    </div>
  );
}
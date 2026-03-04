"use client";

import { useState, useEffect } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save data to backend or local storage
    alert('Registro salvo!');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Registro de Funcionários</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:<br />
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </label><br /><br />
        <label>Chegada:<br />
          <input type="time" name="chegada" value={form.chegada} onChange={handleChange} required />
        </label><br /><br />
        <label>Saída para almoço:<br />
          <input type="time" name="almoco_saida" value={form.almoco_saida} onChange={handleChange} required />
        </label><br /><br />
        <label>Retorno do almoço:<br />
          <input type="time" name="almoco_retorno" value={form.almoco_retorno} onChange={handleChange} required />
        </label><br /><br />
        <label>Saída:<br />
          <input type="time" name="saida" value={form.saida} onChange={handleChange} required />
        </label><br /><br />
        <button type="submit">Salvar Registro</button>
      </form>
    </div>
  );
}

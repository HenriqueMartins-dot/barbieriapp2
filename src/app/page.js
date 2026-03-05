"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [escola, setEscola] = useState("");
  const [escolas, setEscolas] = useState([]);
  const [erro, setErro] = useState("");

  // Carregar lista de escolas do banco
  useEffect(() => {
    const fetchEscolas = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/escolas`);
        console.log(response.data);  // Verifique a resposta da API
        setEscolas(response.data.dados); // Assumindo que a resposta contém o campo `dados` com as escolas
      } catch (error) {
        console.error("Erro ao carregar escolas:", error);
        setErro("Erro ao carregar escolas.");
      }
    };

    fetchEscolas();
  }, []);

  // Função de login
const handleLogin = async () => {
  if (!escola || !senha) {
    setErro("Por favor, selecione uma escola e preencha a senha.");
    return;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
      {
        escola_id: escola,
        senha: senha,
      }
    );

if (response.data.sucesso) {

  const acesso = response.data.acesso;

  // salva no navegador
  localStorage.setItem("acesso", acesso);
  localStorage.setItem("escola_id", escola);

  if (acesso === "secretaria") {
    router.push("/menu");
  }

  else if (acesso === "funcionario") {
    router.push("/menu");
  }




    } else {
      setErro("Senha incorreta ou escola não encontrada.");
    }

  } catch (error) {
    setErro("Erro ao realizar login.");
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="School Logo"
          width={300}
          height={100}
          priority
        />

        <label className={styles.label}>Lista de escolas</label>
        <select
          className={styles.select}
          value={escola}
          onChange={(e) => setEscola(e.target.value)}
        >
          <option value="">Selecione uma escola</option>
          {escolas.map((escolaItem) => (
            <option key={escolaItem.id} value={escolaItem.id}>
              {escolaItem.escola_nome || "Nome não disponível"} {/* Ajuste para usar o campo correto */}
            </option>
          ))}
        </select>

        <input
          type="password"
          className={styles.input}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className={styles.error}>{erro}</p>}

        <button className={styles.button} onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

export default function Home() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [escola, setEscola] = useState("");
  const [escolas, setEscolas] = useState([]);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEscolas = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/escolas`;
        const response = await axios.get(apiUrl);
        setEscolas(response.data.dados || []);
      } catch (error) {
        console.error("Erro ao carregar escolas:", error);
        setErro("Erro ao carregar escolas.");
      }
    };

    fetchEscolas();
  }, []);

  const handleLogin = async () => {
    if (!escola || !senha) {
      setErro("Por favor, selecione uma escola e preencha a senha.");
      return;
    }

    setErro("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/login`, {
        escola_id: escola,
        senha: senha,
      });

      if (response.data.sucesso) {
        const acesso = response.data.acesso;

        localStorage.setItem("acesso", acesso);
        localStorage.setItem("escola_id", escola);
        router.push("/menu");
      } else {
        setErro("Senha incorreta ou escola não encontrada.");
      }
    } catch (error) {
      setErro("Erro ao realizar login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logoWrap}>
          <Image
            className={styles.logo}
            src="/logo.png"
            alt="Logo do sistema escolar"
            width={300}
            height={100}
            priority
          />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Acesso ao sistema</h1>
          <p className={styles.subtitle}>Informe sua escola e senha para entrar.</p>
        </div>

        <label className={styles.label}>Escola</label>
        <select
          className={styles.select}
          value={escola}
          onChange={(e) => setEscola(e.target.value)}
        >
          <option value="">Selecione uma escola</option>
          {escolas.map((escolaItem) => (
            <option key={escolaItem.id} value={escolaItem.id}>
              {escolaItem.escola_nome || "Nome não disponível"}
            </option>
          ))}
        </select>

        <label className={styles.label}>Senha</label>
        <input
          type="password"
          className={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleLogin()}
        />

        {erro && <p className={styles.error}>{erro}</p>}

        <button className={styles.button} onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}


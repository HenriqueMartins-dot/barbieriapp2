"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Menu() {
  const [acesso, setAcesso] = useState("");

  useEffect(() => {
    const tipo = localStorage.getItem("acesso");
    setAcesso(tipo);
  }, []);

  return (
    <div className={styles.menuPage}>
      <main className={styles.content}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Painel principal</p>
          <h1>Bem-vindo ao Sistema Escolar</h1>
          <p>Escolha a área que deseja acessar para continuar o trabalho.</p>
        </div>

        <nav className={styles.navbar}>
          {acesso === "secretaria" && (
            <>
              <Link href="/lista" className={styles.navCard}>
                <span className={styles.navTitle}>Lista de Alunos</span>
                <span className={styles.navDescription}>Visualize e acompanhe o cadastro escolar.</span>
              </Link>

              <Link href="/adicionar" className={styles.navCard}>
                <span className={styles.navTitle}>Adicionar Alunos</span>
                <span className={styles.navDescription}>Cadastre novos alunos com rapidez.</span>
              </Link>

              <Link href="/lista_funcionarios" className={styles.navCard}>
                <span className={styles.navTitle}>Lista de Funcionários</span>
                <span className={styles.navDescription}>Gerencie informações de pessoal.</span>
              </Link>
            </>
          )}

          {(acesso === "secretaria" || acesso === "funcionario") && (
            <Link href="/funcionarios" className={styles.navCard}>
              <span className={styles.navTitle}>Ponto</span>
              <span className={styles.navDescription}>Registre e acompanhe o ponto do dia.</span>
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}
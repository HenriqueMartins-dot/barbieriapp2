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
      <nav className={styles.navbar}>

        {acesso === "secretaria" && (
          <>
            <Link href="/lista">
              <button>Lista de Alunos</button>
            </Link>

            <Link href="/adicionar">
              <button>Adicionar Alunos</button>
            </Link>

            
            <Link href="/lista_funcionarios">
              <button>Lista de Funcionários</button>
            </Link>
  
          </>
        )}

        {(acesso === "secretaria" || acesso === "funcionario") && (
          <Link href="/funcionarios">
            <button>Ponto</button>
          </Link>
        )}

      </nav>

      <main className={styles.content}>
        <h1>Bem-vindo ao Sistema Escolar</h1>
        <p>Escolha uma opção acima.</p>
      </main>
    </div>
  );
}
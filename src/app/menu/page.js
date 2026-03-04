import Link from "next/link";
import styles from "./page.module.css";

export default function Menu() {
  return (
    <div className={styles.menuPage}>
      <nav className={styles.navbar}>
        <Link href="/lista">
          <button>Lista de Alunos</button>
        </Link>
        <Link href="/adicionar">
          <button>Adicionar Alunos</button>
        </Link>
        <Link href="/funcionarios">
          <button>Lista de Funcionários</button>
        </Link>
      </nav>
      <main className={styles.content}>
        <h1>Bem-vindo ao Sistema Escolar</h1>
        <p>Escolha uma opção acima.</p>
      </main>
    </div>
  );
}

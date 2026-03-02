"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";
import { PDFDownloadLink } from '@react-pdf/renderer';
import BoletimPDF from '../../../components/pdf/boletimPDF';
import BoletimSelecionadosPDF from '../../../components/pdf/boletimSelecionadosPDF';
import { pdf } from '@react-pdf/renderer';


export default function ListaAlunos() {
  
  const router = useRouter();

  const [alunos, setAlunos] = useState([]);
  const [filtros, setFiltros] = useState({ // Aqui é onde está os dados do filtro
    nome: "",
    ano: "",
    anoEstudo: "",
    serie: "",
    periodo: "",
    sexo: "",
  });
  const [notas, setNotas] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [anoCurso, setAnoCurso] = useState('');  // Armazenando o ano selecionado
  const [modalAberto, setModalAberto] = useState(false);
  const [modalVerNotasAberto, setModalVerNotasAberto] = useState(false);
  const [notasDoAluno, setNotasDoAluno] = useState({});
  const [notasEditando, setNotasEditando] = useState({ // Aqui é onde está os dados das notas
    matematica: "",
    portugues: "",
    estudos_sociais: "",
    ciencias: "",
    ano_curso: ""
  });

  const [modalEditarAlunoAberto, setModalEditarAlunoAberto] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState({ // Aqui os dados do aluno
    aluno_nome: "",
    cpf: "",         // Add this
    rg: "",          // Add this
    ra: "",          // Add this
    telefones: "",
    data_nascimento: "",
    cidade_natal: "",
    sexo: "",
    nome_pai: "",
    nome_mae: "",
    profissao_pai: "",
    nacionalidade_pai: "",
    residencia: "",
    matricula_primitiva: "",
    matricula_ano_letivo: "",
    ano_curso: "",
    periodo: "",
    observacao: "",
    religiao: "",
    telefones: ""
  });

  const [alunoExpandidoId, setAlunoExpandidoId] = useState(null);

  const toggleExpandir = (id) => {
    setAlunoExpandidoId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alunos`);
        setAlunos(response.data.dados);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchAlunos();
  }, []);

  const toggleSelecionarAluno = (id) => {
  setAlunosSelecionados((prevSelecionados) =>
    prevSelecionados.includes(id)
      ? prevSelecionados.filter((alunoId) => alunoId !== id)
      : [...prevSelecionados, id]
  );
};

const toggleSelecionarTodos = () => {
  if (todosSelecionados) {
    setAlunosSelecionados([]);
  } else {
    setAlunosSelecionados(alunosFiltrados.map((a) => a.id));
  }
};


  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const resetarFiltros = () => {
    setFiltros({
      nome: "",
      ano: "",
      anoEstudo: "",
      serie: "",
      periodo: "",
      sexo: "",
    });
  };

  


  const filtrosAtivos = Object.values(filtros).some((valor) => valor !== "");

const alunosFiltrados = alunos.filter((aluno) => {
  const filtroNome = filtros.nome ? aluno.aluno_nome.toLowerCase().includes(filtros.nome.toLowerCase()) : true;
  const filtroAno = filtros.ano ? aluno.matricula_ano_letivo.includes(filtros.ano) : true;
  const filtroAnoEstudo = filtros.anoEstudo ? aluno.ano_curso?.toString() === filtros.anoEstudo : true;
  const filtroSerie = filtros.serie ? aluno.ano_curso?.toString()[1] === filtros.serie : true;
  const filtroPeriodo = filtros.periodo ? aluno.periodo === filtros.periodo : true;
  const filtroSexo = filtros.sexo ? aluno.sexo === filtros.sexo : true;
  return filtroNome && filtroAno && filtroAnoEstudo && filtroSerie && filtroPeriodo && filtroSexo;
});

const todosSelecionados = alunosFiltrados.length > 0 && alunosFiltrados.every(aluno => alunosSelecionados.includes(aluno.id));


  const deletarAluno = async (aluno) => { //Aqui ele realiza a exclusão de alunos 
    if (!aluno || !aluno.id) {
      alert("ID do aluno inválido.");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este aluno?")) {
      return;
    }

    try {
      console.log("ID enviado para deletar:", aluno.id);

      // Deletando o aluno baseado no id
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/alunos/${aluno.id}`);

      alert("Aluno excluído com sucesso!");

      // Buscar novamente a lista do backend para garantir a atualização correta
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alunos`);
      setAlunos(response.data.dados);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      alert("Erro ao excluir aluno. Verifique a conexão ou tente novamente.");
    }
  };


const verNotas = async (aluno) => {
  if (!aluno || !aluno.id) {
    console.error("Aluno inválido:", aluno);
    alert("Erro: Aluno inválido");
    return;
  }
  
  console.log("=== VER NOTAS ===");
  console.log("Aluno:", aluno);
  console.log("ID do aluno:", aluno.id);
  console.log("URL da API:", `${process.env.NEXT_PUBLIC_API_URL}/notas/${aluno.id}`);
  
  setAlunoSelecionado(aluno);
  setModalVerNotasAberto(true);
  
  // Busca as notas mais recentes do aluno
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notas/${aluno.id}`);
    console.log("Resposta da API:", response.data);

    if (response.data.sucesso) {
      const notasRecebidas = response.data.dados || [];
      console.log("Notas encontradas:", notasRecebidas);
      // Atualiza o estado notasDoAluno para este aluno específico
      setNotasDoAluno(prev => ({ ...prev, [aluno.id]: notasRecebidas }));
    }
  } catch (erro) {
    console.error("Erro completo:", erro);
    console.error("Status:", erro.response?.status);
    console.error("URL que falhou:", erro.config?.url);
    
    // Se der erro 404, assume que não tem notas ainda
    if (erro.response && erro.response.status === 404) {
      console.log("Aluno ainda sem notas cadastradas.");
      setNotasDoAluno(prev => ({ ...prev, [aluno.id]: [] }));
    } else {
      console.error("Erro ao buscar notas:", erro);
      setNotasDoAluno(prev => ({ ...prev, [aluno.id]: [] }));
    }
  }
};

  const formatarData = (data) => { //Isso serve para deixar a data mas bonita e se livrar das outras informações, deixando apenas o dia/mês/ano para ver
    const novaData = new Date(data);
    return novaData.toISOString().slice(0, 19).replace("T", " "); // 'YYYY-MM-DD HH:MM:SS'
  };


  const buscarNotas = async (aluno) => { //Aqui a gente pega as notas para realizar uma edição caso queira 
    try {
      if (!aluno || !aluno.id) {
        alert("Aluno não selecionado corretamente.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notas/${aluno.id}`);

      if (response.data.sucesso && response.data.dados.length > 0) {
        const nota = response.data.dados[0];
        setNotasEditando({
          matematica: nota.matematica,
          portugues: nota.portugues,
          estudos_sociais: nota.estudos_sociais,
          ciencias: nota.ciencias,
          ano_curso: nota.ano_curso
        });
      } else {
        // Inicializa com campos vazios para permitir criação de novas notas
        setNotasEditando({
          matematica: "",
          portugues: "",
          estudos_sociais: "",
          ciencias: "",
          ano_curso: aluno.ano_curso || "",
        });
      }

      setAlunoSelecionado(aluno);
      setModalAberto(true);
      setModalVerNotasAberto(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Nenhuma nota encontrada, mas não é um erro — apenas inicializa os campos
        console.warn("Nenhuma nota existente para este aluno. Inicializando campos vazios.");
        setNotasEditando({
          matematica: "",
          portugues: "",
          estudos_sociais: "",
          ciencias: "",
        });
      } else {
        console.error("Erro ao buscar notas:", error);
        alert("Erro ao carregar notas. Tente novamente.");
        // Mesmo em caso de erro, inicializa campos vazios para não travar a interface
        setNotasEditando({
          matematica: "",
          portugues: "",
          estudos_sociais: "",
          ciencias: "",
          ano_curso: aluno.ano_curso || "",
        });
      }

      // Garante que o modal ainda será aberto mesmo se algo falhar
      setAlunoSelecionado(aluno);
      setModalAberto(true);
      setModalVerNotasAberto(false);
    }

  };



// Removendo o useEffect que carrega notas para todos os alunos automaticamente
// As notas serão carregadas apenas quando necessário (ao abrir o modal "Ver Notas")



  const salvarNotas = async () => { //E aqui as notas seram editadas com sucesso 
    if (!alunoSelecionado || !alunoSelecionado.id) {
      alert("Aluno não selecionado corretamente.");
      return;
    }

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notas/${alunoSelecionado.id}`, notasEditando);
      alert("Notas editadas com sucesso!");

      // Atualiza as notas no estado notasDoAluno para refletir as mudanças
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notas/${alunoSelecionado.id}`);
        if (response.data.sucesso) {
          const notasRecebidas = response.data.dados || [];
          setNotasDoAluno(prev => ({ ...prev, [alunoSelecionado.id]: notasRecebidas }));
        }
      } catch (error) {
        console.error("Erro ao atualizar notas após salvar:", error);
      }

      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
      alert("Erro ao salvar as notas.");
    }
  };

  const editarAluno = (aluno) => { //Ainda edição, mas dessa vez para as informações dos alunos 
    setAlunoSelecionado(aluno);
    setAlunoEditando({
      aluno_nome: aluno.aluno_nome || "",
      cpf: aluno.cpf || "",
      rg: aluno.rg || "",
      ra: aluno.ra || "",
      telefones: aluno.telefones || "",
      data_nascimento: aluno.data_nascimento || "",
      cidade_natal: aluno.cidade_natal || "",
      sexo: aluno.sexo || "",
      nome_pai: aluno.nome_pai || "",
      nome_mae: aluno.nome_mae || "",
      profissao_pai: aluno.profissao_pai || "",
      nacionalidade_pai: aluno.nacionalidade_pai || "",
      residencia: aluno.residencia || "",
      matricula_primitiva: aluno.matricula_primitiva || "",
      matricula_ano_letivo: aluno.matricula_ano_letivo || "",
      ano_curso: aluno.ano_curso || "",
      periodo: aluno.periodo || "",
      observacao: aluno.observacao || "",
      religiao: aluno.religiao || "",  // Garantir que o valor seja uma string vazia, se não houver.
      telefones: aluno.telefones || "",
    });
    setModalEditarAlunoAberto(true);
  };

  const salvarAlunoEditado = async () => {
    try {
      // Verificando se o campo 'cidade_natal' está preenchido
      if (!alunoEditando.cidade_natal) {
        alert("O campo 'Cidade Natal' é obrigatório!");
        return;
      }

      // Formatar a data de nascimento (se necessário)
      const dataNascimentoFormatada = alunoEditando.data_nascimento.split("T")[0];

      // Atualizando o objeto do aluno com a cidade natal
      const alunoAtualizado = { //Lembra do formatarData para deixar a data melhor de se ver, então. Aqui ele está usando ela com todos os itens que usam data
        ...alunoEditando,
        cidade_natal: alunoEditando.cidade_natal,
        data_nascimento: formatarData(alunoEditando.data_nascimento),
        matricula_primitiva: formatarData(alunoEditando.matricula_primitiva),
        matricula_ano_letivo: formatarData(alunoEditando.matricula_ano_letivo),
      };

      // Enviando os dados atualizados para o backend
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/alunos/${alunoSelecionado.id}`, alunoAtualizado);

      alert("Informações do aluno editadas com sucesso!");
      setModalEditarAlunoAberto(false);

      // Recarregar a lista de alunos
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alunos`);
      setAlunos(response.data.dados);
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        let mensagem = "Erro ao salvar as informações do aluno. Tente novamente.";
        if (data) {
          if (typeof data === "string" && data.trim() !== "") {
            mensagem = data;
          } else if (typeof data.message === "string" && data.message.trim() !== "") {
            mensagem = data.message;
          } else if (typeof data.dados === "string" && data.dados.trim() !== "") {
            mensagem = data.dados;
          } else if (error.response.statusText) {
            mensagem = error.response.statusText;
          }
        } else if (error.response.statusText) {
          mensagem = error.response.statusText;
        }
        console.error("Erro ao salvar aluno:", {
          data,
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          fullResponse: error.response
        });
        alert(`Erro ao salvar aluno: ${mensagem}`);
      } else {
        console.error("Erro ao salvar aluno:", error);
        alert("Erro ao salvar as informações do aluno. Tente novamente.");
      }
    }
  };

return (
  <div className={styles.listaPage}>
    {modalAberto && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          {/* Modal de editar notas */}
          <h2>Editar Notas de {alunoSelecionado?.aluno_nome || "Aluno"}</h2>
          {/* ... seu formulário de notas ... */}
          <button onClick={salvarNotas}>Salvar</button>
          <button onClick={() => setModalAberto(false)}>Fechar</button>
        </div>
      </div>
    )}

          {modalAberto && ( //Modal para editar as notas do aluno cujo botão editar notas for clicado 
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar Notas de {alunoSelecionado?.aluno_nome || "Aluno"}</h2>
            <div>
              <label>Matemática</label>
              <input
                type="text"
                value={notasEditando.matematica || ""}
                onChange={(e) => setNotasEditando({ ...notasEditando, matematica: e.target.value })}
              />
            </div>
            <div>
              <label>Português</label>
              <input
                type="text"
                value={notasEditando.portugues || ""}
                onChange={(e) => setNotasEditando({ ...notasEditando, portugues: e.target.value })}
              />
            </div>
            <div>
              <label>Estudos Sociais</label>
              <input
                type="text"
                value={notasEditando.estudos_sociais || ""}
                onChange={(e) => setNotasEditando({ ...notasEditando, estudos_sociais: e.target.value })}
              />
            </div>
            <div>
              <label>Ciências</label>
              <input
                type="text"
                value={notasEditando.ciencias || ""}
                onChange={(e) => setNotasEditando({ ...notasEditando, ciencias: e.target.value })}
              />
            </div>
            <button onClick={salvarNotas}>Salvar</button>
            <button onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}



    {modalVerNotasAberto && alunoSelecionado && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2>Notas de {alunoSelecionado.aluno_nome}</h2>

          {notasDoAluno[alunoSelecionado.id] && notasDoAluno[alunoSelecionado.id].length > 0 ? (
            <div>
              {notasDoAluno[alunoSelecionado.id].map((nota, index) => (
                <div key={index} style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  margin: '10px 0', 
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {nota.ano_curso ? `${nota.ano_curso}º Ano` : 'Ano não especificado'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div><strong>Matemática:</strong> {nota.matematica || 'N/A'}</div>
                    <div><strong>Português:</strong> {nota.portugues || 'N/A'}</div>
                    <div><strong>Estudos Sociais:</strong> {nota.estudos_sociais || 'N/A'}</div>
                    <div><strong>Ciências:</strong> {nota.ciencias || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma nota cadastrada para este aluno.</p>
          )}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={async () => {
                // Refresh notes for this student
                try {
                  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notas/${alunoSelecionado.id}`);
                  if (response.data.sucesso) {
                    const notasRecebidas = response.data.dados || [];
                    setNotasDoAluno(prev => ({ ...prev, [alunoSelecionado.id]: notasRecebidas }));
                  }
                } catch (error) {
                  console.error("Erro ao atualizar notas:", error);
                }
              }}
              style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              🔄 Atualizar
            </button>
            <button onClick={() => setModalVerNotasAberto(false)}>Fechar</button>
          </div>
        </div>
      </div>
    )}

           {modalEditarAlunoAberto && ( //Modal para editar os alunos 
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar Informações do Aluno</h2>
            <div>
              <label>Nome</label>
              <input
                type="text"
                value={alunoEditando.aluno_nome}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, aluno_nome: e.target.value })}
              />
            </div>
            <div>
              <label>Religião</label>
              <input
                type="text"
                value={alunoEditando.religiao}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, religiao: e.target.value })}
              />
            </div>
            <div>
              <label>Data de Nascimento</label>
              <input
                type="date"
                value={alunoEditando.data_nascimento}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, data_nascimento: e.target.value })}
              />
            </div>
            <div>
              <label>Cidade Natal</label>
              <input
                type="text"
                value={alunoEditando.cidade_natal}  // Sempre um valor controlado
                onChange={(e) => setAlunoEditando({ ...alunoEditando, cidade_natal: e.target.value })}
              />
            </div>
            <div>
              <label>Sexo</label>
              <input
                type="text"
                value={alunoEditando.sexo}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, sexo: e.target.value })}
              />
            </div>
            <div>
              <label>Nome do Pai</label>
              <input
                type="text"
                value={alunoEditando.nome_pai}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, nome_pai: e.target.value })}
              />
            </div>
            <div>
              <label>Nome da Mãe</label>
              <input
                type="text"
                value={alunoEditando.nome_mae}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, nome_mae: e.target.value })}
              />
            </div>
            <div>
              <label>Profissão do Pai</label>
              <input
                type="text"
                value={alunoEditando.profissao_pai}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, profissao_pai: e.target.value })}
              />
            </div>
            <div>
              <label>Nacionalidade Pai</label>
              <input
                type="text"
                value={alunoEditando.nacionalidade_pai}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, nacionalidade_pai: e.target.value })}
              />
            </div>
            <div>
              <label>Residência</label>
              <input
                type="text"
                value={alunoEditando.residencia}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, residencia: e.target.value })}
              />
            </div>
            <div>
              <label>Matrícula Primitiva</label>
              <input
                type="date"
                value={alunoEditando.matricula_primitiva}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, matricula_primitiva: e.target.value })}
              />
            </div>
            <div>
              <label>Matrícula Ano Letivo</label>
              <input
                type="date"
                value={alunoEditando.matricula_ano_letivo}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, matricula_ano_letivo: e.target.value })}
              />
            </div>
            <div>
              <label>Ano Curso</label>
              <input
                type="text"
                value={alunoEditando.ano_curso}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, ano_curso: e.target.value })}
              />
            </div>
            <div>
              <label>Período</label>
              <input
                type="text"
                value={alunoEditando.periodo}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, periodo: e.target.value })}
              />
            </div>
            <div>
              <label>Observações</label>
              <input
                type="text"
                value={alunoEditando.observacao}
                onChange={(e) => setAlunoEditando({ ...alunoEditando, observacao: e.target.value })}
              />
            </div>
            <button onClick={salvarAlunoEditado}>Salvar</button>
            <button onClick={() => setModalEditarAlunoAberto(false)}>Fechar</button>
          </div>
        </div>
      )}


    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <button onClick={() => router.back()} className={styles.voltarButton}>
          ⬅️ Voltar
        </button>
        <h1 className={styles.title}>Lista de Alunos</h1>
      </div>

  <div className={styles.filtros}>
    <input
      type="text"
      name="nome"
      placeholder="Nome"
      value={filtros.nome}
      onChange={handleFiltroChange}
    />
    <input
      type="text"
      name="ano"
      placeholder="Ano"
      value={filtros.ano}
      onChange={handleFiltroChange}
    />
    <input
      type="text"
      name="anoEstudo"
      placeholder="Ano de Estudo"
      value={filtros.anoEstudo}
      onChange={handleFiltroChange}
    />
    <input
      type="text"
      name="serie"
      placeholder="Série"
      value={filtros.serie}
      onChange={handleFiltroChange}
    />
    <input
      type="text"
      name="periodo"
      placeholder="Período"
      value={filtros.periodo}
      onChange={handleFiltroChange}
    />
    <input
      type="text"
      name="sexo"
      placeholder="Sexo"
      value={filtros.sexo}
      onChange={handleFiltroChange}
    />
    <button onClick={resetarFiltros} style={{ background: "#e3eafc", color: "#1976d2" }}>
      Limpar Filtros
    </button>
    <button className={styles.pdfButton} onClick={async () => {
            try {
              const alunosValidos = alunos.filter((a) => alunosSelecionados.includes(a.id));

              if (alunosValidos.length === 0) {
                alert("Selecione ao menos um aluno");
                return;
              }
                // Mapeia todos os alunos válidos e pega suas notas
                const alunosComNotas = await Promise.all(
                  alunosValidos.map(async (aluno) => {
                    try {
                      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notas/${aluno.id}`);
                      const notasLinhas = response.data?.dados || [];

                      // Transforma cada linha (com várias disciplinas) em entradas por disciplina
                      const entradasPorDisciplina = [];
                      notasLinhas.forEach((linha) => {
                        const ano = linha.ano_curso ?? linha.ano ?? aluno.ano_curso ?? "Ano não informado";
                        if (linha.matematica) entradasPorDisciplina.push({ ano, disciplina_nome: "Matemática", nota: linha.matematica, status: "" });
                        if (linha.portugues) entradasPorDisciplina.push({ ano, disciplina_nome: "Português", nota: linha.portugues, status: "" });
                        if (linha.estudos_sociais) entradasPorDisciplina.push({ ano, disciplina_nome: "Estudos Sociais", nota: linha.estudos_sociais, status: "" });
                        if (linha.ciencias) entradasPorDisciplina.push({ ano, disciplina_nome: "Ciências", nota: linha.ciencias, status: "" });
                      });

                      // Agrupa por ano
                      const notasPorAno = entradasPorDisciplina.reduce((acc, entrada) => {
                        const ano = entrada.ano || "Sem Ano";
                        if (!acc[ano]) acc[ano] = [];
                        acc[ano].push({
                          disciplina_nome: entrada.disciplina_nome,
                          nota: entrada.nota,
                          status: entrada.status,
                        });
                        return acc;
                      }, {});

                      return {
                        aluno_nome: aluno.aluno_nome,
                        id: aluno.id,
                        notasPorAno,
                      };
                    } catch (err) {
                      // Caso o aluno não tenha notas (404)
                      return {
                        aluno_nome: aluno.aluno_nome,
                        id: aluno.id,
                        notasPorAno: {},
                      };
                    }
                  })
                );

                // Gera PDF apenas com notas dos alunos selecionados
                const blob = await pdf(<BoletimSelecionadosPDF alunos={alunosComNotas} />).toBlob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `boletim_selecionados.pdf`;
                link.click();
                URL.revokeObjectURL(url);

            } catch (err) {
              console.error("Erro ao gerar PDF de selecionados:", err);
              alert("Erro ao gerar PDF dos alunos selecionados. Tente novamente.");
            }
          }}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: 500,
            cursor: "pointer",
            marginRight: 8,
          }}
        >
          📄 Gerar PDF Selecionados
        </button>
        {alunosSelecionados.length > 0 && (
          <button
            onClick={async () => {
              if (!confirm("Tem certeza que deseja excluir os alunos selecionados?")) return;
              try {
                await Promise.all(
                  alunosSelecionados.map((id) =>
                    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/alunos/${id}`)
                  )
                );
                alert("Alunos excluídos com sucesso!");
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alunos`);
                setAlunos(response.data.dados);
                setAlunosSelecionados([]);
              } catch (error) {
                console.error("Erro ao excluir alunos:", error);
                alert("Erro ao excluir alunos.");
              }
            }}
            style={{
              background: "#c00",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            🗑️ Excluir Selecionados
          </button>
        )}
      </div>
    </div>

    {filtrosAtivos ? (
      alunosFiltrados.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={todosSelecionados}
                  onChange={toggleSelecionarTodos}
                />
              </th>
              <th>Nome</th>
              <th>Data Nascimento</th>
              <th>Naturalidade</th>
              <th>Sexo</th>
              <th>Filiação</th>
              <th>Residência</th>
              <th>Matrícula Primitiva</th>
              <th>Matrícula Ano Letivo</th>
              <th>Ano Curso</th>
              <th>Período</th>
              <th>Observações</th>
              <th>Ver Notas</th>
              <th>Edição</th>
            </tr>
          </thead>
          <tbody>
{alunosFiltrados.map((aluno) => {
  return (
    <React.Fragment key={aluno.id}>
      <tr>
        <td>
          <input
            type="checkbox"
            checked={alunosSelecionados.includes(aluno.id)}
            onChange={() => toggleSelecionarAluno(aluno.id)}
          />
        </td>
        <td>
          {aluno.aluno_nome}
          <button
  className={styles.pdfButton}
  onClick={async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notas/${aluno.id}`
      );

      const notasLinhas = response.data?.dados || [];
      console.log("Notas do backend:", notasLinhas);

      // Transforma cada linha (com várias disciplinas) em entradas por disciplina
      const entradasPorDisciplina = [];
      notasLinhas.forEach((linha) => {
        const ano = linha.ano_curso ?? linha.ano ?? aluno.ano_curso ?? "Ano não informado";
        if (linha.matematica) entradasPorDisciplina.push({ ano, disciplina_nome: "Matemática", nota: linha.matematica, status: "" });
        if (linha.portugues) entradasPorDisciplina.push({ ano, disciplina_nome: "Português", nota: linha.portugues, status: "" });
        if (linha.estudos_sociais) entradasPorDisciplina.push({ ano, disciplina_nome: "Estudos Sociais", nota: linha.estudos_sociais, status: "" });
        if (linha.ciencias) entradasPorDisciplina.push({ ano, disciplina_nome: "Ciências", nota: linha.ciencias, status: "" });
      });

      // Agrupa por ano no formato esperado pelo PDF
      const notasPorAno = entradasPorDisciplina.reduce((acc, entrada) => {
        const ano = entrada.ano || "Sem Ano";
        if (!acc[ano]) acc[ano] = [];
        acc[ano].push({
          disciplina_nome: entrada.disciplina_nome,
          nota: entrada.nota,
          status: entrada.status,
        });
        return acc;
      }, {});
      console.log("Notas agrupadas por ano:", notasPorAno);

      const alunoComNotas = {
        aluno_nome: aluno.aluno_nome,
        id: aluno.id,
        notasPorAno,
        matricula: aluno.matricula_primitiva,
        ano: aluno.ano_curso,
        dataNascimento: aluno.data_nascimento,
        cidadeNatal: aluno.cidade_natal,
        sexo: aluno.sexo,
        religiao: aluno.religiao,
        profissaoPai: aluno.profissao_pai,
        nacionalidadePai: aluno.nacionalidade_pai,
        telefone: aluno.telefone,
        email: aluno.email,
        observacao: aluno.observacao,
        telefones: aluno.telefones,
      };
      console.log("Objeto aluno para PDF:", alunoComNotas);

      const blob = await pdf(<BoletimPDF aluno={alunoComNotas} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boletim-${aluno.aluno_nome}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      // Tratar aluno sem notas (404)
      if (err.response?.status === 404) {
        console.warn("Nenhuma nota encontrada para este aluno.");

        const alunoComNotas = {
          aluno_nome: aluno.aluno_nome,
          id: aluno.id,
          notasPorAno: {}, // vazio
          matricula: aluno.matricula_primitiva,
          ano: aluno.ano_curso,
          dataNascimento: aluno.data_nascimento,
          cidadeNatal: aluno.cidade_natal,
          sexo: aluno.sexo,
          religiao: aluno.religiao,
          profissaoPai: aluno.profissao_pai,
          nacionalidadePai: aluno.nacionalidade_pai,
          telefone: aluno.telefone,
          email: aluno.email,
          observacao: aluno.observacao,
          telefones: aluno.telefones,
        };

        const blob = await pdf(<BoletimPDF aluno={alunoComNotas} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `boletim-${aluno.aluno_nome}.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        return;
      }

      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar PDF. Tente novamente.");
    }
  }}
>
  Gerar PDF
</button>

          <button onClick={() => toggleExpandir(aluno.id)}>
            {alunoExpandidoId === aluno.id ? "▲" : "▼"}
          </button>
        </td>
                    <td>{new Date(aluno.data_nascimento).toLocaleDateString()}</td>
                    <td>{aluno.cidade_natal}</td>
                    <td>{aluno.sexo}</td>
                    <td>
                      {aluno.nome_pai && aluno.nome_mae ? (
                        <>
                          {aluno.nome_pai}
                          <br />
                          <br />
                          {aluno.nome_mae}
                        </>
                      ) : (
                        `${aluno.nome_pai ? aluno.nome_pai : ""} ${
                          aluno.nome_mae ? aluno.nome_mae : ""
                        }`
                      )}
                    </td>
                    <td>{aluno.residencia}</td>
                    <td>{new Date(aluno.matricula_primitiva).toLocaleDateString()}</td>
                    <td>{new Date(aluno.matricula_ano_letivo).toLocaleDateString()}</td>
                    <td>{aluno.ano_curso}</td>
                    <td>{aluno.periodo}</td>
                    <td>{aluno.observacao}</td>
                    <td>
                      <button onClick={() => verNotas(aluno)}>Ver Notas</button>
                    </td>
                    <td>
                      <button onClick={() => buscarNotas(aluno)}>Editar Notas</button>
                      <button onClick={() => editarAluno(aluno)}>Editar Aluno</button>
                      <button onClick={() => deletarAluno(aluno)}>Excluir Aluno</button>
                    </td>
                  </tr>

                  {alunoExpandidoId === aluno.id && (
                    <tr>
                      <td colSpan={18}>
                        <div style={{
                          background: "#fff",
                          padding: "24px",
                          borderRadius: "12px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                          margin: "16px 0",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "32px",
                        }}>
                          <div style={{ minWidth: 220, flex: 1 }}>
                            <h3 style={{ margin: "0 0 12px 0", color: "#1976d2", fontWeight: 600, fontSize: 18 }}>
                              📋 Informações Adicionais
                            </h3>
                            <div style={{ lineHeight: 2, fontSize: 15 }}>
                              <span>📞 <strong>Telefone:</strong> {aluno.telefones || <span style={{ color: "#aaa" }}>Não informado</span>}</span><br />
                              <span>🪪 <strong>CPF:</strong> {aluno.cpf || <span style={{ color: "#aaa" }}>Não informado</span>}</span><br />
                              <span>📄 <strong>RG:</strong> {aluno.rg || <span style={{ color: "#aaa" }}>Não informado</span>}</span><br />
                              <span>🔢 <strong>RA:</strong> {aluno.ra || <span style={{ color: "#aaa" }}>Não informado</span>}</span><br />
                              <span>👨‍🔧 <strong>Profissão do Pai:</strong> {aluno.profissao_pai || <span style={{ color: "#aaa" }}>Não informado</span>}</span><br />
                              <span>🌎 <strong>Nacionalidade do Pai:</strong> {aluno.nacionalidade_pai || <span style={{ color: "#aaa" }}>Não informado</span>}</span><br />
                              <span>🏠 <strong>Residência:</strong> {aluno.residencia || <span style={{ color: "#aaa" }}>Não informado</span>}</span>
                            </div>
                          </div>
                          
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Nenhum aluno encontrado com os filtros aplicados.</p>
      )
    ) : (
      <p></p>
    )}
  </div>
)}

"use client";

import { useState, useEffect } from "react";
import axios from "axios";  // Importa o axios para as requisições API
import { API_BASE_URL } from "../../lib/api";
import styles from "./page.module.css";
import debounce from "lodash/debounce";

export default function AdicionarAluno() {
  const [telaAtual, setTelaAtual] = useState("menu"); 
  const [formularioNotas, setFormularioNotas] = useState(false);  // Novo estado para controlar o formulário de notas

  // Estados para informações do aluno
  const [alunoId, setAlunoId] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [ra, setRa] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [dataNascimento, setDataNascimento] = useState("");
  const [cidadeNatal, setCidadeNatal] = useState("");
  const [nomePai, setNomePai] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [profissaoPai, setProfissaoPai] = useState("");
  const [nacionalidadePai, setNacionalidadePai] = useState("");
  const [residencia, setResidencia] = useState("");
  const [matriculaPrimitiva, setMatriculaPrimitiva] = useState("");
  const [matriculaAnoLetivo, setMatriculaAnoLetivo] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [anosPreenchidos, setAnosPreenchidos] = useState([]);
  const [eliminacaoData, setEliminacaoData] = useState("");
  const [eliminacaoCausa, setEliminacaoCausa] = useState("");
  const [observacao, setObservacao] = useState(""); // Estado para observação;
  const [religiao, setReligiao] = useState("");
  const [telefones, setTelefones] = useState("");

  // Estados para notas
  const [matematica, setMatematica] = useState("");
  const [portugues, setPortugues] = useState("");
  const [estudosSociais, setEstudosSociais] = useState("");
  const [ciencias, setCiencias] = useState("");

  // Estado para o sexo
  const [sexo, setSexo] = useState("");

  const resetarFormulario = () => {
    setAlunoId(null);
    setNome("");
    setCpf("");
    setRg("");
    setRa("");
    setDataNascimento("");
    setCidadeNatal("");
    setNomePai("");
    setNomeMae("");
    setProfissaoPai("");
    setNacionalidadePai("");
    setResidencia("");
    setMatriculaPrimitiva("");
    setMatriculaAnoLetivo("");
    setAnoSelecionado("");
    setSexo("");
    setObservacao("");
    setEliminacaoData("");
    setEliminacaoCausa("");
    setReligiao("");
    setMatematica("");
    setPortugues("");
    setEstudosSociais("");
    setCiencias("");
    setAnosPreenchidos([]);
    setFormularioNotas(false);
    setTelaAtual("menu");
    setTelefones("");
  };


const handleSalvarAno = async (e) => {
  e.preventDefault();

  if (!anoSelecionado) {
    alert("Por favor, selecione um ano para salvar as notas.");
    return;
  }

  try {
    // SEMPRE cria um NOVO aluno para cada ano (nunca reutiliza)
    const alunoData = {
      aluno_nome: nome,
      cpf,
      rg,
      ra,
      data_nascimento: dataNascimento,
      cidade_natal: cidadeNatal,
      nome_pai: nomePai,
      nome_mae: nomeMae,
      profissao_pai: profissaoPai,
      nacionalidade_pai: nacionalidadePai,
      residencia: residencia,
      matricula_primitiva: matriculaPrimitiva,
      matricula_ano_letivo: matriculaAnoLetivo,
      ano_curso: anoSelecionado, // Ano específico para este aluno
      sexo: sexo,
      observacao: observacao,
      eliminacao_data: eliminacaoData || null,
      eliminacao_causa: eliminacaoCausa,
      religiao: religiao,
      telefones: telefones
    };

    console.log("Criando NOVO aluno para o ano:", anoSelecionado);
    console.log("Dados do aluno:", alunoData);
    console.log("URL da API alunos:", `${API_BASE_URL}/alunos`);

    // Cria um novo aluno para este ano
    const alunoResponse = await axios.post(`${API_BASE_URL}/alunos`, alunoData);
    console.log("Resposta da criação do aluno:", alunoResponse.data);
    
    // A API retorna dados diretamente como ID, não como objeto
    const novoAlunoId = alunoResponse.data.dados;
    console.log("Novo aluno criado com ID:", novoAlunoId, "para o ano:", anoSelecionado);

    // Cadastra as notas para o novo aluno
    const dadosDoAno = {
      ano_curso: anoSelecionado,
      aluno_id: novoAlunoId,
      matematica,
      portugues,
      estudos_sociais: estudosSociais,
      ciencias,
    };

    console.log("=== SALVANDO NOTAS ===");
    console.log("Dados das notas:", dadosDoAno);
    console.log("URL da API:", `${API_BASE_URL}/notas`);

    const notasResponse = await axios.post(`${API_BASE_URL}/notas`, dadosDoAno);
    console.log("Resposta ao salvar notas:", notasResponse.data);
    
    alert(`Aluno do ${anoSelecionado}º ano criado com sucesso!`);

    const continuar = window.confirm("Deseja adicionar notas de outro ano para este mesmo aluno?");

    if (continuar) {
      // Limpa apenas as notas e o ano, mas mantém os dados pessoais
      // O alunoId é resetado para que um novo aluno seja criado na próxima vez
      setAlunoId(null);
      setAnoSelecionado("");
      setMatematica("");
      setPortugues("");
      setEstudosSociais("");
      setCiencias("");
      
      // GARANTE que o formulário de notas continue visível
      setFormularioNotas(true);
      
      console.log("Formulário limpo para próximo ano. Dados pessoais mantidos. Formulário de notas visível.");
    } else {
      // Limpa tudo e volta para o menu
      resetarFormulario();
      setTelaAtual("menu");
    }

  } catch (error) {
    console.error("Erro ao salvar aluno ou notas:", error);
    alert("Erro ao salvar dados. Verifique as informações e tente novamente.");
  }
};
const enviarTodosOsDados = async (dados) => {
  try {
    for (const ano of dados) {
      await axios.post(`${API_BASE_URL}/notas`, ano);
    }
    alert("Dados enviados com sucesso!");
    resetForm();
    setTelaAtual("menu");
    setFormularioNotas(false);
    setAnosPreenchidos([]);
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    alert("Erro ao salvar os dados.");
  }
};


const handleSalvarAluno = async (e) => {
  e.preventDefault();

  const alunoData = {
    aluno_nome: nome,
    data_nascimento: dataNascimento,
    cidade_natal: cidadeNatal,
    nome_pai: nomePai,
    nome_mae: nomeMae,
    profissao_pai: profissaoPai,
    nacionalidade_pai: nacionalidadePai,
    residencia: residencia,
    matricula_primitiva: matriculaPrimitiva,
    matricula_ano_letivo: matriculaAnoLetivo,
    ano_curso: anoSelecionado,
    sexo: sexo,
    observacao: observacao,
    eliminacao_data: eliminacaoData || null,
    eliminacao_causa: eliminacaoCausa,
    religiao: religiao,
  };

  try {
    const alunoResponse = await axios.post(`${API_BASE_URL}/alunos`, alunoData);

    console.log("Resposta do servidor:", alunoResponse.data);

    // Ajuste aqui conforme a resposta correta
    const idAlunoCriado = alunoResponse.data.dados.id || alunoResponse.data.dados;
    setAlunoId(idAlunoCriado);

    setFormularioNotas(true);

    alert("Aluno cadastrado com sucesso! Agora, insira as notas.");
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error.response || error);
    alert("Ocorreu um erro ao salvar as informações.");
  }
};


  const [selecionouSugestao, setSelecionouSugestao] = useState(false);

useEffect(() => {
  if (!selecionouSugestao) {
    buscarSugestoes(nome);
  } else {
    setSelecionouSugestao(false); // Resetar flag para próximas digitações
  }
}, [nome]);


const handleSalvarNotas = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/notas`, {
      aluno_id: alunoId,
      matematica,
      portugues,
      estudosSociais,
      ciencias
    });

    if (response.data.sucesso) {
      const adicionarOutroAno = window.confirm("Notas salvas com sucesso. Deseja adicionar notas para outro ano?");

      if (adicionarOutroAno) {
        // Limpa os campos e permite escolher novo ano
        setMatematica('');
        setPortugues('');
        setEstudosSociais('');
        setCiencias('');
        setAnoSelecionado('');  // ou permitir nova escolha

        // IMPORTANTE: não salvar de novo aqui, já foi salvo acima
      } else {
        alert("Cadastro finalizado.");
        // Feche modal ou resete tudo
        setFormularioNotas(false);
        setAlunoId(null);
      }
    } else {
      alert("Erro ao salvar notas.");
    }

  } catch (error) {
    console.error("Erro ao salvar notas:", error);
    alert("Erro ao salvar notas.");
  }
};

  const buscarSugestoes = debounce(async (texto) => {
    if (!texto || texto.length < 2) {
      setSugestoes([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/alunos?busca=${texto}`);
      const nomesFiltrados = res.data.dados.filter(aluno =>
        aluno.aluno_nome.toLowerCase().includes(texto.toLowerCase())
      );
      setSugestoes(nomesFiltrados);
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
    }
  }, 300);


  return (
    <div className={styles.adicionarPage}>
{telaAtual === "menu" && (
  <div>
    <h1 className={styles.title}>Adicionar Aluno</h1>
<button
  className={styles.button}
  onClick={() => {
    resetarFormulario();
    setAlunoId(null);  // garante limpar o id
    setTelaAtual("aluno");
  }}
>
  Cadastrar Aluno
</button>
  </div>
)}      {telaAtual === "aluno" && (
        <form onSubmit={handleSalvarAluno} className={styles.form}>
          {/* Campo nome */}
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="RG"
            value={rg}
            onChange={(e) => setRg(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="RA"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Telefones"
            value={telefones}
            onChange={(e) => setTelefones(e.target.value)}
            className={styles.input}
          />

          {/* Lista suspensa de sugestões */}
          {sugestoes.length > 0 && (
            <ul className={styles.sugestoesLista}>
              {sugestoes.map((aluno) => (
                <li
  key={aluno.id}
onClick={async () => {
  const dados = aluno;

  setNome(dados.aluno_nome);
  setDataNascimento(dados.data_nascimento || "");
  setCidadeNatal(dados.cidade_natal || "");
  setNomePai(dados.nome_pai || "");
  setNomeMae(dados.nome_mae || "");
  setProfissaoPai(dados.profissao_pai || "");
  setNacionalidadePai(dados.nacionalidade_pai || "");
  setResidencia(dados.residencia || "");
  setMatriculaPrimitiva(dados.matricula_primitiva || "");
  setMatriculaAnoLetivo(dados.matricula_ano_letivo || "");
  setAnoSelecionado(""); // Reset ano para permitir escolha
  setSexo(dados.sexo || "");
  setObservacao(dados.observacao || "");
  setEliminacaoData(dados.eliminacao_data || "");
  setEliminacaoCausa(dados.eliminacao_causa || "");
  setReligiao(dados.religiao || "");
  setTelefones(dados.telefones || "");
  // NÃO seta o alunoId quando selecionar sugestão - queremos criar um novo registro
  setAlunoId(null);
  
  // Não busca notas existentes - sempre cria um novo registro
  setAnosPreenchidos([]);

  setSugestoes([]);
  setSelecionouSugestao(true);
  setFormularioNotas(true); // Vai direto para o formulário de notas
}}


  className={styles.sugestaoItem}
>
  {aluno.aluno_nome}
</li>

              ))}
              <li>
                <button onClick={() => setSugestoes([])}>Cancelar</button>
              </li>
            </ul>
          )}
          <input type="text" placeholder="Religiao" value={religiao} onChange={(e) => setReligiao(e.target.value)} className={styles.input} />
          <input
            type={dataNascimento ? "date" : "text"}
            value={dataNascimento || ""}
            onFocus={(e) => e.target.type = "date"}
            onBlur={(e) => {
              if (!dataNascimento) e.target.type = "text";
            }}
            onChange={(e) => setDataNascimento(e.target.value)}
            className={styles.input}
            placeholder="Data de Nascimento"
          />
          <input type="text" placeholder="Naturalidade" value={cidadeNatal} onChange={(e) => setCidadeNatal(e.target.value)} required className={styles.input} />
          <input type="text" placeholder="Nome do Pai" value={nomePai} onChange={(e) => setNomePai(e.target.value)} required className={styles.input} />
          <input type="text" placeholder="Nome da Mãe" value={nomeMae} onChange={(e) => setNomeMae(e.target.value)} className={styles.input} />
          <input type="text" placeholder="Profissão do Pai" value={profissaoPai} onChange={(e) => setProfissaoPai(e.target.value)} className={styles.input} />
          <input type="text" placeholder="Nacionalidade do Pai" value={nacionalidadePai} onChange={(e) => setNacionalidadePai(e.target.value)} required className={styles.input} />
          <input type="text" placeholder="Residência" value={residencia} onChange={(e) => setResidencia(e.target.value)} required className={styles.input} />
          <input
            type={matriculaPrimitiva ? "date" : "text"}
            value={matriculaPrimitiva || ""}
            onFocus={(e) => e.target.type = "date"}
            onBlur={(e) => {
              if (!matriculaPrimitiva) e.target.type = "text";
            }}
            onChange={(e) => setMatriculaPrimitiva(e.target.value)}
            className={styles.input}
            placeholder="Matrícula Primitiva"
          />
          <input
            type={matriculaAnoLetivo ? "date" : "text"}
            value={matriculaAnoLetivo || ""}
            onFocus={(e) => e.target.type = "date"}
            onBlur={(e) => {
              if (!matriculaAnoLetivo) e.target.type = "text";
            }}
            onChange={(e) => setMatriculaAnoLetivo(e.target.value)}
            className={styles.input}
            placeholder="Matrícula Ano Letivo"
          />

<select value={anoSelecionado} onChange={(e) => setAnoSelecionado(e.target.value)} required className={styles.select}>
            <option value="">Selecione o Ano</option>
            <option value="1">1º Ano</option>
            <option value="2">2º Ano</option>
            <option value="3">3º Ano</option>
            <option value="4">4º Ano</option>
          </select>

          <select value={sexo} onChange={(e) => setSexo(e.target.value)} required className={styles.select}>
            <option value="">Selecione o Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>

          <textarea
            placeholder="Observação (Opcional)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className={styles.textarea}
          ></textarea>

          <button type="submit" className={styles.button}>Próximo</button>
          <button type="button" className={styles.buttonSecundario} onClick={() => setTelaAtual("menu")}>Cancelar</button>
        </form>
      )}

      {/* Formulário para notas */}
      {/* Formulário para notas */}
{formularioNotas && (
  <form onSubmit={handleSalvarAno} className={styles.form}>
    <h3>Preencher notas por ano</h3>

    <select
      value={anoSelecionado}
      onChange={(e) => setAnoSelecionado(e.target.value)}
      required
      className={styles.select}
    >
      <option value="">Selecione o Ano</option>
      {[1, 2, 3, 4].map((ano) => (
        <option
          key={ano}
          value={ano}
          disabled={anosPreenchidos.some((a) => a.ano_curso === String(ano))}
        >
          {ano}º Ano
        </option>
      ))}
    </select>

    <input
      type="text"
      placeholder="Matemática"
      value={matematica}
      onChange={(e) => setMatematica(e.target.value)}
      className={styles.input}
    />
    <input
      type="text"
      placeholder="Português"
      value={portugues}
      onChange={(e) => setPortugues(e.target.value)}
      className={styles.input}
    />
    <input
      type="text"
      placeholder="Estudos Sociais"
      value={estudosSociais}
      onChange={(e) => setEstudosSociais(e.target.value)}
      className={styles.input}
    />
    <input
      type="text"
      placeholder="Ciências"
      value={ciencias}
      onChange={(e) => setCiencias(e.target.value)}
      className={styles.input}
    />

    <button type="submit" className={styles.button}>Salvar Ano</button>
    <button type="button" className={styles.buttonSecundario} onClick={() => setFormularioNotas(false)}>Pular</button>
  </form>
)}

      <button className={styles.button} onClick={() => window.history.back()}>Voltar</button>
    </div>
  );
}

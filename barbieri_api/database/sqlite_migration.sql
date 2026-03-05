-- SQLite migration script for Barbieri app
-- Run this script with the SQLite CLI or a migration tool

CREATE TABLE IF NOT EXISTS escolas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    escola_nome TEXT NOT NULL,
    escola_endereco TEXT NOT NULL,
    escola_telefone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    escola_id INTEGER,
    usuario_senha TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_nome TEXT NOT NULL,
    data_nascimento TEXT,
    cidade_natal TEXT,
    nome_pai TEXT,
    nome_mae TEXT,
    profissao_pai TEXT,
    nacionalidade_pai TEXT,
    residencia TEXT,
    matricula_primitiva TEXT,
    matricula_ano_letivo TEXT,
    ano_curso TEXT,
    sexo TEXT,
    observacao TEXT,
    eliminacao_data TEXT,
    eliminacao_causa TEXT,
    religiao TEXT,
    cpf TEXT,
    rg TEXT,
    ra TEXT,
    telefones TEXT
);

CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    ano_curso TEXT,
    matematica REAL,
    portugues REAL,
    estudos_sociais REAL,
    ciencias REAL,
    FOREIGN KEY(aluno_id) REFERENCES alunos(id)
);


CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cargo TEXT NOT NULL,
    data_contratacao TEXT NOT NULL,
    salario REAL NOT NULL
);

SHOW CREATE TABLE funcionarios;
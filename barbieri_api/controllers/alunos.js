
const db = require ('../database/connection');

module.exports = {
    async listarAlunos(request, response) {
        try {
            const sql = `SELECT * FROM alunos;`;
            const alunos = await db.query(sql);
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de alunos.',
                dados: alunos[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarAlunos(request, response) {
        try {
            const {
                aluno_nome, data_nascimento, cidade_natal, nome_pai, nome_mae = null,
                profissao_pai, nacionalidade_pai, residencia, matricula_primitiva,
                matricula_ano_letivo, ano_curso, sexo, observacao = null, 
                eliminacao_data = null, eliminacao_causa = null, religiao = null,
                cpf = null, rg = null, ra = null, telefones = null // New fields
            } = request.body;

            const sql = `INSERT INTO alunos (
                aluno_nome, data_nascimento, cidade_natal, nome_pai, nome_mae,
                profissao_pai, nacionalidade_pai, residencia, matricula_primitiva,
                matricula_ano_letivo, ano_curso, sexo, observacao, eliminacao_data, 
                eliminacao_causa, religiao, cpf, rg, ra, telefones
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

            const values = [
                aluno_nome, data_nascimento, cidade_natal, nome_pai, nome_mae,
                profissao_pai, nacionalidade_pai, residencia, matricula_primitiva,
                matricula_ano_letivo, ano_curso, sexo, observacao, eliminacao_data, 
                eliminacao_causa, religiao, cpf, rg, ra, telefones
            ];

            const execSql = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de aluno realizado com sucesso.',
                dados: execSql[0].insertId
            });
        } catch(error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarAlunos(request, response) {
        try {
            const { id } = request.params;
            const {
                aluno_nome, data_nascimento, cidade_natal, nome_pai, nome_mae = null,
                profissao_pai  = null, nacionalidade_pai = null, residencia, matricula_primitiva,
                matricula_ano_letivo, ano_curso, sexo, observacao = null, 
                eliminacao_data = null, eliminacao_causa = null, religiao = null,
                cpf = null, rg = null, ra = null, telefones = null // New fields
            } = request.body;

            if (!id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do aluno é obrigatório na URL.'
                });
            }

            const sql = `UPDATE alunos SET
            aluno_nome = ?, data_nascimento = ?, cidade_natal = ?, nome_pai = ?, nome_mae = ?,
            profissao_pai = ?, nacionalidade_pai = ?, residencia = ?, matricula_primitiva = ?,
            matricula_ano_letivo = ?, ano_curso = ?, sexo = ?, observacao = ?, eliminacao_data = ?, 
            eliminacao_causa = ?, religiao = ?, cpf = ?, rg = ?, ra = ?, telefones = ?
            WHERE id = ?;
            `;

            const values = [
                aluno_nome, data_nascimento, cidade_natal, nome_pai, nome_mae,
                profissao_pai, nacionalidade_pai, residencia, matricula_primitiva,
                matricula_ano_letivo, ano_curso, sexo, observacao, eliminacao_data, 
                eliminacao_causa, religiao, cpf, rg, ra, telefones, id
            ];

            const [atualizaDados] = await db.query(sql, values);

            if (atualizaDados.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Nenhum aluno encontrado com ID ${id}.`
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Aluno ${id} atualizado com sucesso.`,
                dados: atualizaDados.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

async buscarAlunos(request, response) {
  try {
    const { busca } = request.query;

    if (!busca || busca.trim() === "") {
      return response.status(400).json({
        sucesso: false,
        mensagem: "Parâmetro de busca obrigatório.",
        dados: []
      });
    }

    const sql = `SELECT * FROM alunos WHERE aluno_nome LIKE ? LIMIT 5;`;
        const [rows] = await db.query(sql, [`%${busca}%`]);

        return response.status(200).json({
            sucesso: true,
            mensagem: "Resultados encontrados.",
            dados: rows
        });
  } catch (error) {
    return response.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar alunos.",
      dados: error.message
    });
  }
},


    async apagarAlunos(request, response) {
        try {
            const { id } = request.params;

            if (!id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do aluno é obrigatório na URL.'
                });
            }

            const sql = `DELETE FROM alunos WHERE id = ?;`;
            const values = [id];

            const [excluir] = await db.query(sql, values);

            if (excluir.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Nenhum aluno encontrado com ID ${id}.`
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Aluno ${id} excluído com sucesso.`,
                dados: excluir.affectedRows
            });
        } catch(error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
};

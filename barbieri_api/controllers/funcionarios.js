const db = require('../database/connection');

module.exports = {

async listarFuncionarios(request, response) {
    try {

        const { escola_id } = request.query;

        const sql = `SELECT * FROM funcionarios WHERE escola_id = ?`;

        const [rows] = await db.query(sql, [escola_id]);

        return response.status(200).json({
            sucesso: true,
            message: "Lista de funcionários.",
            dados: rows
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            message: "Erro na requisição.",
            dados: error.message
        });
    }
},
async cadastrarFuncionario(request, response) {
  try {

    console.log(request.body); // 👈 ver o que está chegando

    const { escola_id, nome, chegada, almoco_saida, almoco_retorno, saida, observacao, posicao } = request.body;
    const sql = `
        INSERT INTO funcionarios
        (escola_id, nome, chegada, almoco_saida, almoco_retorno, saida, posicao, observacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
        Number(escola_id),  // 👈 converter para número
        nome,
        chegada,
        almoco_saida,
        almoco_retorno,
        saida,
        posicao, // 👈 posicao inicialmente nula
        observacao, // 👈 observacao inicialmente nula
    ];

    const [result] = await db.query(sql, values);

    return response.status(200).json({
        sucesso: true,
        message: "Registro salvo.",
        dados: result.insertId
    });

  } catch (error) {
    console.error("ERRO FUNCIONARIOS:", error); // 👈 MUITO IMPORTANTE
    return response.status(500).json({
        sucesso: false,
        message: "Erro na requisição.",
        dados: error.message
    });
  }
},

async editarFuncionario(request, response) {

    try {

        const { id } = request.params;
        const { nome, chegada, almoco_saida, almoco_retorno, saida, posicao, observacao } = request.body;

        const sql = `
            UPDATE funcionarios
            SET nome = ?, chegada = ?, almoco_saida = ?, almoco_retorno = ?, saida = ?, posicao = ?, observacao = ?
            WHERE id = ?;
        `;

        const values = [nome, chegada, almoco_saida, almoco_retorno, saida, posicao, observacao, id];

        const [result] = await db.query(sql, values);

        return response.status(200).json({
            sucesso: true,
            message: "Registro atualizado.",
            dados: result.affectedRows
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            message: "Erro na requisição.",
            dados: error.message
        });
    }
},
    async apagarFuncionario(request, response) {

        try {

            const { id } = request.params;

            const sql = `DELETE FROM funcionarios WHERE id = ?`;

            const [result] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                message: "Funcionário excluído.",
                dados: result.affectedRows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                message: "Erro na requisição.",
                dados: error.message
            });
        }
    },

    async atualizarObservacao(request, response) {

  try {

    const { id } = request.params;
    const { observacao } = request.body;

    const sql = `
      UPDATE funcionarios
      SET observacao = ?
      WHERE id = ?
    `;

    await db.query(sql, [observacao, id]);

    return response.status(200).json({
      sucesso: true
    });

  } catch (error) {

    return response.status(500).json({
      sucesso: false,
      message: error.message
    });

  }

},

async registrarPonto(request, response) {

  try {

const { escola_id, nome, tipo, posicao, observacao } = request.body;


    if (!escola_id || !nome || !tipo) {
      return response.status(400).json({
        sucesso: false,
        message: "Dados incompletos"
      });
    }

    const sqlBusca = `
      SELECT * FROM funcionarios
      WHERE escola_id = ?
      AND nome = ?
      AND DATE(data_registro) = CURDATE()
      LIMIT 1
    `;

    const [rows] = await db.query(sqlBusca, [escola_id, nome]);

    if (rows.length === 0) {

      if (tipo !== "chegada") {
        return response.status(400).json({
          sucesso: false,
          message: "Primeiro registro precisa ser chegada"
        });
      }

      const sqlInsert = `
        INSERT INTO funcionarios (escola_id, nome, posicao, chegada, observacao)
VALUES (?, ?, ?, NOW(), ?)
      `;

      await db.query(sqlInsert, [escola_id, nome, posicao, observacao]);

    } else {

      const registro = rows[0];

      let campo = "";

      if (tipo === "almoco_saida") campo = "almoco_saida";
      if (tipo === "almoco_retorno") campo = "almoco_retorno";
      if (tipo === "saida") campo = "saida";

      if (!campo) {
        return response.status(400).json({
          sucesso: false,
          message: "Tipo inválido"
        });
      }

      const sqlUpdate = `
        UPDATE funcionarios
        SET ${campo} = NOW()
        WHERE id = ?
      `;

      await db.query(sqlUpdate, [registro.id]);

    }

    return response.status(200).json({
      sucesso: true,
      message: "Registro realizado"
    });

  } catch (error) {

    console.error(error);

    return response.status(500).json({
      sucesso: false,
      message: "Erro no servidor"
    });

  }


}

};
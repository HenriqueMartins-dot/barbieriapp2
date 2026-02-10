
const db = require ('../database/connection');

module.exports = {
  // Endpoint de login
  async login(request, response) {
    try {
      const { escola_id, senha } = request.body;

      if (!escola_id || !senha) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "Escola e senha são obrigatórios.",
        });
      }

      // Verifica se existe um usuário com a escola e senha fornecida
      const sql = `SELECT * FROM usuarios WHERE escola_id = ? AND usuario_senha = ?`;
      const values = [escola_id, senha];
            const usuarios = await db.query(sql, values);
            if (usuarios[0].length === 0) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: "Usuário ou senha inválidos.",
                });
            }
            return response.status(200).json({
                sucesso: true,
                mensagem: "Login bem-sucedido.",
                dados: usuarios[0],
            });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    }
  },

    async listarUsuario(request, response) {
        try {
            //Instruções SQL
            const sql = `Select
            usuario_id, escola_id, usuario_senha, data_criacao
            FROM usuarios;`;
            const usuarios = await db.query(sql);
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuarios.',
                dados: usuarios[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.mensagem
            });
        }
    },

    async cadastrarUsuarios(request, response) {
        try {
            const { usuario_senha } = request.body;

            const sql = `INSERT INTO usuarios
            (usuario_senha)
            VALUES (?)`;
            const values = [usuario_senha];

            const execSql = await db.query(sql, values);

            const usuario_id = execSql[0].insertId;
            return response.status(200).json ({
                sucesso: true, 
                mensagem: 'Cadastro de usuarios.',
                dados: usuario_id
            });
        } catch(error) {
            return response.status(500).json ({
                sucesso: false,
                mensagem: 'Erro na requisição. ',
                dados: error.message
            });
        }
    },

    async editarUsuarios(request, response) {
        try {
            const { usuario_senha } = request.body;
            const { usuario_id } = request.params;
    
            // Verifica se o ID foi enviado corretamente
            if (!usuario_id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O ID do usuário é obrigatório na URL."
                });
            }
    
            // Verifica se a senha foi enviada
            if (!usuario_senha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "A senha do usuário é obrigatória."
                });
            }
    
            const sql = `UPDATE usuarios SET usuario_senha = ? WHERE usuario_id = ?;`;
            const values = [usuario_senha, usuario_id];
    
            const [atualizaDados] = await db.query(sql, values);
    
            // Verifica se alguma linha foi afetada
            if (atualizaDados.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Nenhum usuário encontrado com ID ${usuario_id}.`
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usuario_id} atualizado com sucesso.`,
                dados: atualizaDados.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message  // Corrigido para capturar erro corretamente
            });
        }
    },
    
    async apagarUsuarios(request, response) {
        try {
            const { usuario_id } = request.params;

            const sql = `DELETE FROM usuarios WHERE usuario_id = ?`;

            const values = [usuario_id];

            const excluir = await db.query(sql, values);


            return response.status(200).json ({
                sucesso: true, 
                mensagem: `Usuario ${usuario_id} excluido com sucesso`,
                dados: excluir[0].affectedRows
            });
        } catch(error) {
            return response.status(500).json ({
                sucesso: false,
                mensagem: 'Erro na requisição. ',
                dados: error.mensagem
            });
        }
    },


}
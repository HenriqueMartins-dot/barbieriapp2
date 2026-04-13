
const db = require('../database/connection');

module.exports = {
    async listarEscolas(request, response) {
        try {
            console.log('listarEscolas: Iniciando consulta SQL...');
            const sql = 'SELECT * FROM escolas';
            const escolas = await db.query(sql);
            console.log('listarEscolas: Consulta SQL finalizada. Resultado:', escolas[0]);
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de escolas.',
                dados: escolas[0]
            });
        } catch (error) {
            console.error('listarEscolas: Erro na consulta SQL:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.mensagem
            });
        }
    },

    async cadastrarEscolas(request, response) {
        try {
            const { escola_nome, escola_endereco, escola_telefone } = request.body;

            if (!escola_nome || !escola_endereco || !escola_telefone) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, endereço e telefone da escola são obrigatórios.'
                });
            }

            const sql = 'INSERT INTO escolas (escola_nome, escola_endereco, escola_telefone) VALUES (?, ?, ?)';
            const values = [escola_nome, escola_endereco, escola_telefone];

            const execSql = await db.query(sql, values);

            const escola_id = execSql[0].insertId;
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de escola realizado com sucesso.',
                dados: escola_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.mensagem
            });
        }
    },

    async editarEscolas(request, response) {
        try {
            const { escola_nome, escola_endereco, escola_telefone } = request.body;
            const { id } = request.params;  // Aqui estamos pegando o ID da URL
    
            // Verifica se o ID foi enviado corretamente
            if (!id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O ID da escola é obrigatório na URL."
                });
            }
    
            // Verifica se os campos necessários foram enviados
            if (!escola_nome || !escola_endereco || !escola_telefone) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Os dados da escola (nome, endereço e telefone) são obrigatórios."
                });
            }
    
            const sql = `UPDATE escolas SET escola_nome = ?, escola_endereco = ?, escola_telefone = ? WHERE id = ?`;
            const values = [escola_nome, escola_endereco, escola_telefone, id];
    
            const [atualizaDados] = await db.query(sql, values);

            // Verifica se alguma linha foi afetada
            if (atualizaDados.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Nenhuma escola encontrada com ID ${id}.`
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Escola ${id} atualizada com sucesso.`,
                dados: atualizaDados.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });
        }
    },
    
    async apagarEscolas(request, response) {
        try {
            const { id } = request.params;  // Pegando o ID da URL
    
            // Verifica se o ID foi enviado corretamente
            if (!id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O ID da escola é obrigatório na URL."
                });
            }
    
            const sql = `DELETE FROM escolas WHERE id = ?`;
            const values = [id];
    
            const excluir = await db.query(sql, values);
    
            // Verifica se alguma linha foi afetada
            if (excluir[0].affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Nenhuma escola encontrada com ID ${id}.`
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: `Escola ${id} excluída com sucesso.`,
                dados: excluir[0].affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });
        }
    }
    };

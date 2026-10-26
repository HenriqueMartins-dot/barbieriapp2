const db = require('../database/connection');

const TOTAL_SALAS = 13;
const PERIODOS = ['manha', 'tarde'];
const MAX_QUANTIDADE = 4294967295;

function validarData(data) {
    if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return false;
    }

    const dataUtc = new Date(`${data}T00:00:00.000Z`);
    return !Number.isNaN(dataUtc.getTime()) && dataUtc.toISOString().slice(0, 10) === data;
}

function validarContagens(contagens) {
    return Array.isArray(contagens)
        && contagens.length === TOTAL_SALAS
        && contagens.every((quantidade) =>
            quantidade === null
            || (Number.isInteger(quantidade) && quantidade >= 0 && quantidade <= MAX_QUANTIDADE)
        );
}

module.exports = {
    async inicializarTabela() {
        await db.query(
            `CREATE TABLE IF NOT EXISTS contagem_criancas (
                escola_id INT UNSIGNED NOT NULL,
                data_contagem DATE NOT NULL,
                sala TINYINT UNSIGNED NOT NULL,
                turno VARCHAR(10) NOT NULL,
                quantidade INT UNSIGNED NULL,
                atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (escola_id, data_contagem, sala, turno)
            ) ENGINE=InnoDB`
        );
    },

    async listarContagens(request, response) {
        try {
            const escolaId = Number(request.query.escola_id);
            const { data } = request.query;

            if (!Number.isSafeInteger(escolaId) || escolaId <= 0 || !validarData(data)) {
                return response.status(400).json({
                    sucesso: false,
                    message: 'Informe uma escola e uma data válidas.',
                });
            }

            const [rows] = await db.query(
                `SELECT sala, turno, quantidade
                 FROM contagem_criancas
                 WHERE escola_id = ? AND data_contagem = ?`,
                [escolaId, data]
            );

            const dados = {
                manha: Array(TOTAL_SALAS).fill(null),
                tarde: Array(TOTAL_SALAS).fill(null),
            };

            rows.forEach(({ sala, turno, quantidade }) => {
                if (PERIODOS.includes(turno) && sala >= 1 && sala <= TOTAL_SALAS) {
                    dados[turno][sala - 1] = quantidade;
                }
            });

            return response.status(200).json({ sucesso: true, dados });
        } catch (error) {
            console.error('Erro ao carregar quantidades de crianças:', error);
            return response.status(500).json({
                sucesso: false,
                message: 'Erro ao carregar os registros.',
            });
        }
    },

    async listarDatas(request, response) {
        try {
            const escolaId = Number(request.query.escola_id);

            if (!Number.isSafeInteger(escolaId) || escolaId <= 0) {
                return response.status(400).json({
                    sucesso: false,
                    message: 'Informe uma escola válida.',
                });
            }

            const [rows] = await db.query(
                `SELECT
                    data_contagem AS data,
                    SUM(CASE WHEN turno = 'manha' THEN quantidade ELSE 0 END) AS total_manha,
                    SUM(CASE WHEN turno = 'tarde' THEN quantidade ELSE 0 END) AS total_tarde,
                    SUM(CASE WHEN turno = 'manha' AND quantidade IS NOT NULL THEN 1 ELSE 0 END) AS salas_manha,
                    SUM(CASE WHEN turno = 'tarde' AND quantidade IS NOT NULL THEN 1 ELSE 0 END) AS salas_tarde
                 FROM contagem_criancas
                 WHERE escola_id = ?
                 GROUP BY data_contagem
                 ORDER BY data_contagem DESC`,
                [escolaId]
            );

            return response.status(200).json({ sucesso: true, dados: rows });
        } catch (error) {
            console.error('Erro ao listar registros de crianças:', error);
            return response.status(500).json({
                sucesso: false,
                message: 'Erro ao carregar a lista de registros.',
            });
        }
    },

    async salvarContagens(request, response) {
        try {
            const { escola_id: escolaId, data, manha, tarde } = request.body;
            const escolaIdNumero = Number(escolaId);

            if (
                !Number.isSafeInteger(escolaIdNumero)
                || escolaIdNumero <= 0
                || !validarData(data)
                || !validarContagens(manha)
                || !validarContagens(tarde)
            ) {
                return response.status(400).json({
                    sucesso: false,
                    message: 'Informe uma escola, data e quantidades válidas para as 13 salas.',
                });
            }

            const values = PERIODOS.flatMap((turno) =>
                (turno === 'manha' ? manha : tarde).map((quantidade, indice) => [
                    escolaIdNumero,
                    data,
                    indice + 1,
                    turno,
                    quantidade,
                ])
            );

            await db.query(
                `INSERT INTO contagem_criancas
                    (escola_id, data_contagem, sala, turno, quantidade)
                 VALUES ?
                 ON DUPLICATE KEY UPDATE
                    quantidade = VALUES(quantidade),
                    atualizado_em = CURRENT_TIMESTAMP`,
                [values]
            );

            return response.status(200).json({
                sucesso: true,
                message: 'Quantidades salvas com sucesso.',
            });
        } catch (error) {
            console.error('Erro ao salvar quantidades de crianças:', error);
            return response.status(500).json({
                sucesso: false,
                message: 'Erro ao salvar os registros.',
            });
        }
    },
};

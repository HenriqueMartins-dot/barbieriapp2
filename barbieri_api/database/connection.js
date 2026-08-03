
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const bd_usuario = process.env.DB_USER || 'root';
const bd_senha = process.env.DB_PASSWORD || '12345';
const bd_servidor = process.env.DB_HOST || '127.0.0.1';
const bd_porta = Number(process.env.DB_PORT || 3306);
const bd_banco = process.env.DB_NAME || 'barbieri';
let connection;

const config = {
    host: bd_servidor,
    port: bd_porta,
    user: bd_usuario,
    password: bd_senha,
    database: bd_banco,
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0,
}

try {
    connection = mysql.createPool(config);
    console.log('Chamou conexão MySql!');
} catch (error) {
    console.log(error);
}

connection.getConnection()
    .then(conn => {
        console.log("Conexão com o banco de dados bem-sucedida!");
        conn.release();
    })
    .catch(err => {
        console.error("Erro ao conectar ao banco de dados:", err);
    });

module.exports = connection;
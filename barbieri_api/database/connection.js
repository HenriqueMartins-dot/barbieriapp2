
const mysql = require('mysql2/promise');

const bd_usuario = 'root'; // usuário
const bd_senha = '12345'; // senha
const bd_servidor = '127.0.0.1'; // servidor
const bd_porta = '3306'; // porta
const bd_banco = 'barbieri'; // nome do banco
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
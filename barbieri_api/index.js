const express = require('express'); 
const cors = require('cors'); 
const path = require('path');

const router = require('./routers/routers');
const CriancasController = require('./controllers/criancas');

const app = express(); 
app.use(cors()); 
app.use(express.json()); 

// Configura o Express para servir arquivos estáticos da pasta 'public'
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(router);

// Adicionando a rota de status
app.get('/status', (req, res) => {
  res.json({ message: 'API funcionando corretamente' });
});


const porta = Number(process.env.API_PORT || 3001);

CriancasController.inicializarTabela()
    .then(() => {
        app.listen(porta, '0.0.0.0', () => {
            console.log(`Servidor iniciado na porta ${porta}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao preparar a tabela de contagem de crianças:', error);
        process.exitCode = 1;
    });

app.get('/', (request, response) => {
    response.send('teste 6');
});

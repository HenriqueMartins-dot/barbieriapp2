const express = require('express'); 
const cors = require('cors'); 
const path = require('path');

const router = require('./routers/routers');

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


// Defina a porta
const porta = 3001;

app.listen(porta, '0.0.0.0', () => {
    console.log(`Servidor iniciado na porta ${porta}`);
});

app.get('/', (request, response) => {
    response.send('teste 6');
});

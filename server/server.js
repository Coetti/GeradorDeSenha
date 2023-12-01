const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Password = require('./PasswordSchema');
const { log } = require('console');

const app = express();

// Definindo as opções do CORS
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'], 
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'], 
  },
});

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb+srv://coettigabriel6:6pP5Ze68i1ruCRjk@senhas.mrzvfkx.mongodb.net/')
  .then(() => {
    console.log('Conexão bem-sucedida com o MongoDB!');
  })
  .catch((error) => {
    console.error('Erro de conexão com o MongoDB:', error);
  });

// Rota GET para gerar e armazenar senha aleatória
app.get('/generate-password/:type', async (req, res) => {
  const { type } = req.params;

  let newPassword;

  if (type === 'normal') {
    newPassword = 'FN' + Math.random().toString(36).slice(2, 6).toUpperCase();
  } else if (type === 'priority') {
    newPassword = 'FP' + Math.random().toString(36).slice(2, 6).toUpperCase();
  } else {
    res.status(400).send('Tipo inválido');
    return;
  }

  try {
    // Criando uma nova senha usando o modelo Password
    const password = new Password({
      password: newPassword,
      type: type === 'normal' ? 'normal' : 'prioritaria',
    });

    // Salvando a nova senha no banco de dados
    await password.save();

    res.status(201).send({ password: newPassword });
  } catch (error) {
    console.error('Erro ao salvar a senha:', error);
    res.status(500).send('Erro ao criar e armazenar a senha');
  }
});

//Rota para pegar no banco as senhas que não foram chamadas e separa-las pela prioridade, e ordena-las pela data de criação
app.get('/get-passwords', async (req, res) => {
  try {
    // Buscar todas as senhas com status false, ordenadas pela data de criação
    const passwords = await Password.find({ status: false }).sort({ createdAt: 1 });

    // Filtrar e separar as senhas por prefixo (FN e FP)
    const fnPasswords = passwords.filter((pw) => pw.password.startsWith('FN'));
    const fpPasswords = passwords.filter((pw) => pw.password.startsWith('FP'));
    console.log(fnPasswords + fpPasswords)

    // Enviar os arrays separados como resposta
    res.status(200).send({ fnPasswords, fpPasswords });
  } catch (error) {
    console.error('Erro ao obter senhas:', error);
    res.status(500).send('Erro ao buscar as senhas');
  }
});

// Rota GET para emitir mensagem para os clientes conectados
app.get('/return-password', async (req, res) => {
  try {
    // Buscar senhas com status false e ordená-las
    const passwords = await Password.find({ status: false }).sort({ createdAt: 1 });

    // Filtrar e separar as senhas por prefixo (FN e FP)
    const fnPasswords = passwords.filter((pw) => pw.password.startsWith('FN'));
    const fpPasswords = passwords.filter((pw) => pw.password.startsWith('FP'));

    // Concatenar os arrays de senhas prioritárias e não prioritárias
    const allPasswords = [...fpPasswords, ...fnPasswords];

    if (allPasswords.length > 0) {
      // Atualizar o campo status para true na primeira senha
      const firstPassword = allPasswords[0];
      firstPassword.status = true;
      await firstPassword.save(); // Salvar a alteração no banco de dados
    
      // Enviar o array para o cliente através do Socket.io
      io.emit('passwords', allPasswords);
    
      // Responder à requisição GET com o array de senhas
      res.status(200).send(allPasswords);
    } else {
      res.status(404).send('Não há senhas disponíveis.');
    }
  } catch (error) {
    console.error('Erro ao retornar senha:', error);
    res.status(500).send('Erro ao retornar a senha');
  }
});



const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

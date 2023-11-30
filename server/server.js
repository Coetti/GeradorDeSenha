const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Definindo as opções do CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Substitua pela origem do seu cliente
  methods: ['GET', 'POST'], // Permitir métodos GET e POST
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permitir todos os origens para Socket.IO
    methods: ['GET', 'POST'], // Permitir métodos GET e POST para Socket.IO
  },
});


let newPassword="";
// Rota GET para gerar senha aleatória
app.get('/generate-password/:type', (req, res) => {
  const { type } = req.params;

  if(type==='normal'){
    newPassword = 'FN'+ Math.random().toString(36).slice(2, 6).toUpperCase();
  } else if (type==='priority'){
    newPassword = 'FP' + Math.random().toString(36).slice(2, 6).toUpperCase();
  } else {
    res.status(400).send('Tipo inválido');
    return;
  }
  
  res.send({ password: newPassword });

});

// Rota GET para emitir mensagem para os clientes conectados
app.get('/return-password', (req, res) => {
  
  // Emitindo a mensagem para todos os clientes conectados
  io.emit('password', newPassword);
  
  // Enviando uma resposta HTTP para quem fez a requisição
  res.status(200).send('Senha enviada para os clientes conectados!');
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

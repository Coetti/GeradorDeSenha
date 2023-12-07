const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Password = require('./PasswordSchema');
const { log } = require('console');

const app = express();

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

const connectionString = 'sua connection string';

mongoose.connect(connectionString)
  .then(() => {
    console.log('Conexão bem-sucedida com o MongoDB!');
  })
  .catch((error) => {
    console.error('Erro de conexão com o MongoDB:', error);
  });


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

    const password = new Password({
      password: newPassword,
      type: type === 'normal' ? 'normal' : 'prioritaria',
    });

    await password.save();

    res.status(201).send({ password: newPassword });
  } catch (error) {
    console.error('Erro ao salvar a senha:', error);
    res.status(500).send('Erro ao criar e armazenar a senha');
  }
}); 

app.get('/return-password', async (req, res) => {
  try {
    const passwords = await Password.find({ status: false }).sort({ createdAt: 1 });

    const fnPasswords = passwords.filter((pw) => pw.password.startsWith('FN'));
    const fpPasswords = passwords.filter((pw) => pw.password.startsWith('FP'));

    const allPasswords = [...fpPasswords, ...fnPasswords];

    if (allPasswords.length > 0) {
      const firstPassword = allPasswords[0];
      firstPassword.status = true;
      await firstPassword.save(); 
    
      io.emit('passwords', allPasswords);
   
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

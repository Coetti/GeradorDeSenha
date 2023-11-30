import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const PasswordViewer = () => {
  const [receivedPassword, setReceivedPassword] = useState('');

  useEffect(() => {
    socket.emit('getSenhaAtual', (senhaAtual) => {
      setReceivedPassword(senhaAtual);
    });

    socket.on('password', (password) => {
      setReceivedPassword(password);
    });
  }, []);

  return (
    <div>
      <h2>SENHA</h2>
      <p>{receivedPassword}</p>
    </div>
  );
};

export default PasswordViewer;

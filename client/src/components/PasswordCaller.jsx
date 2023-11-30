import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

const PasswordCaller = () => {

  const [returnedPassword, setReturnedPassword] = useState("");  

  const handleChamarSenha = async () => {
    try {
      const response = await axios.get('http://localhost:3001/return-password');
    } catch (error) {
      console.error('Erro ao receber a senha:', error);
    }
  }; 

  return (
    <div>
      <h2>PasswordCaller</h2>
      <button onClick={handleChamarSenha}>Chamar próxima senha</button>
    </div>
  );
};

export default PasswordCaller;

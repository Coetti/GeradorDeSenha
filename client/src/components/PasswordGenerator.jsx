import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Substitua pela URL do seu servidor

const PasswordGenerator = () => {
  const [senhaNormal, setSenhaNormal] = useState("");

  useEffect(() => {
    socket.on('password', (password) => {
      console.log("Senha Gerada: ", password)
    });
  }, []);

  const handleGerarSenha = async (type) => {
    try {
      const response = await axios.get(`http://localhost:3001/generate-password/${type}`);
      const { password } = response.data;
      setSenhaNormal(password);
    } catch (error) {
      console.error('Erro ao gerar a senha:', error);
    }
  };

  return (
    <div>PasswordGenerator
      <button onClick={() => handleGerarSenha('normal')}>Gerar Senha Normal</button>
      <button onClick={() => handleGerarSenha('priority')}>Gerar Senha Prioridade</button>
    </div>
  );
};

export default PasswordGenerator;

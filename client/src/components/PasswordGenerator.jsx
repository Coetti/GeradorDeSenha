import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './PasswordGenerator.module.css'

const socket = io('http://localhost:3001'); 

const PasswordGenerator = () => {
  const [senhaNormal, setSenhaNormal] = useState("");
  const [gerandoSenha, setGerandoSenha] = useState(false);

  useEffect(() => {
    socket.on('password', (password) => {
      console.log("Senha Gerada: ", password)
      setSenhaNormal(password);
      setGerandoSenha(false);
    });
  }, []);

  const handleGerarSenha = async (type) => {
    setGerandoSenha(true);

    try {
      const response = await axios.get(`http://localhost:3001/generate-password/${type}`);
      const { password } = response.data;
      setSenhaNormal(password);
      console.log(password);
      setGerandoSenha(false);
    } catch (error) {
      console.error('Erro ao gerar a senha:', error);
      setGerandoSenha(false);
    }
  };

  return (
    <div className={styles.box}>
      <h1 className={styles.tituloh1}>GERAR SENHA</h1>
      <button onClick={() => handleGerarSenha('normal')} className={styles.myButtons}>FILA NORMAL</button>
      <button onClick={() => handleGerarSenha('priority')} className={styles.myButtons}>FILA PRIORIDADE</button>
      {gerandoSenha && (
        <div className={styles.generatedPassword}>
          <h3>GERANDO SENHA...</h3>
        </div>
      )}
      {senhaNormal && !gerandoSenha && (
        <div className={styles.generatedPassword}>
          <h3>SENHA GERADA</h3>
          <p className={styles.password}>{senhaNormal}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;

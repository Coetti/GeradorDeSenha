import  { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import styles from './PasswordCaller.module.css'

const socket = io('http://localhost:3001');

const PasswordCaller = () => {
  const [returnedPasswords, setReturnedPasswords] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPasswordIndex, setCurrentPasswordIndex] = useState(0);

  const handleChamarSenha = async () => {
    try {
      const response = await axios.get('http://localhost:3001/return-password');
      const data = response.data;
      setReturnedPasswords(data);
    } catch (error) {
      console.error('Erro ao receber a senha:', error);
    }
  };

  useEffect(() => {
    socket.on('passwords', (passwords) => {
      setReturnedPasswords(passwords);
    });

    socket.emit('getSenhaAtual');

    return () => {
      socket.off('passwords');
    };
  }, []);

  const renderPasswords = () => {
    if (returnedPasswords.length === 0) {
      return <p className={styles.passwordEmpty}>NENHUMA SENHA EM ESPERA!</p>;
    }

    const currentPassword = returnedPasswords[currentPasswordIndex];

    return (
      <div>
        <div className={styles.currentlyPassword}>
        <h3>SENHA ATUAL</h3>
        <p>{currentPassword.password}</p>
        </div>
        <div className={styles.nextPasswords}>
        <h3>PRÓXIMAS SENHAS</h3>
        <ul className={styles.ulNextPasswords}>
          {returnedPasswords.slice(currentPasswordIndex + 1, currentPasswordIndex + 4).map((password, index) => (
            <li key={index}>{password.password} </li>
          ))}
        </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.box}>
      <h1 className={styles.tituloh1}>CONTROLE DE SENHAS</h1>
      <button onClick={handleChamarSenha} className={styles.myButtons}>AVANÇAR SENHA</button>
      {renderPasswords()}
    </div>
  );
};

export default PasswordCaller;

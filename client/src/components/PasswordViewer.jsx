import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from './PasswordViewer.module.css'

const socket = io('http://localhost:3001');

const PasswordViewer = () => {
  const [receivedPasswords, setReceivedPasswords] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPasswordIndex, setCurrentPasswordIndex] = useState(0);

  useEffect(() => {
    socket.on('passwords', (passwords) => {
      setReceivedPasswords(passwords);
    });

    socket.emit('getSenhaAtual');

    return () => {
      socket.off('passwords');
    };
  }, []);

  const renderPasswords = () => {
    if (receivedPasswords.length === 0) {
      return <p className={styles.passwordEmpty}>NENHUMA SENHA EM ESPERA</p>;
    }

    const currentPassword = receivedPasswords[currentPasswordIndex];

    return (
      <div>
        <div className={styles.generatedPassword}>
        <h3>SENHA ATUAL</h3>
        <p className={styles.password}>{currentPassword.password}</p>
        </div>
        <div className={styles.passwordQueue}>
        <h3>PRÓXIMAS SENHAS</h3>
        <ul>
          {receivedPasswords.slice(currentPasswordIndex + 1, currentPasswordIndex + 4).map((password, index) => (
            <li key={index}>{password.password}</li>
          ))}
        </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.box}>
      <h1 className={styles.tituloh1}>MONITOR DE SENHAS</h1>
      {renderPasswords()}
    </div>
  );
};

export default PasswordViewer;

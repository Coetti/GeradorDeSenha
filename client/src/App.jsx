import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import PasswordGenerator from './components/PasswordGenerator';
import PasswordViewer from './components/PasswordViewer';
import PasswordCaller from './components/PasswordCaller';

function NavigationButtons() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  // Verifica se está na rota raiz para renderizar os botões
  if (location.pathname === '/') {
    return (
      <div className='box'>
        <div>
        <h1 className='tituloh1'>GERADOR DE SENHAS</h1>
        <button  onClick={() => handleNavigation('/gerador')} className="myButtons">GERADOR</button>
        <button onClick={() => handleNavigation('/controle')} className="myButtons">CONTROLE</button>
        <button onClick={() => handleNavigation('/monitor')} className="myButtons">MONITOR</button>
        </div>
      </div>
    );
  }

  return null;
}

function App() {
  return (
    <Router>
      <div>
        <NavigationButtons />

        <Routes>
          <Route path="/gerador" element={<PasswordGenerator />} />
          <Route path="/controle" element={<PasswordCaller />} />
          <Route path="/monitor" element={<PasswordViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

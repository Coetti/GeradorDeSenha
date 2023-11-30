import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import PasswordGenerator from "./components/PasswordGenerator"
import PasswordViewer from "./components/PasswordViewer"
import PasswordCaller from './components/PasswordCaller'


function App() {

  return (
    <Router>
      <Routes>
      <Route path='/gerador' element={<PasswordGenerator/>}/>
      <Route path='/controle' element={<PasswordCaller/>}/>
      <Route path='/monitor' element={<PasswordViewer/>}/>
      </Routes>
    </Router>
  )
}

export default App

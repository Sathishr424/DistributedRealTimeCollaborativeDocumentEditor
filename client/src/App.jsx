import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/authorized/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DocumentEditor from "./pages/anyone/DocumentEditor.jsx";

function App() {
  return <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
        <Route path='/document' element={<DocumentEditor />} />
    </Routes>
  </Router>
}

export default App

import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css';
import logo from '../assets/teleton-logo.png';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/usuarioService';

const Login: React.FC = () => {

  const navigate = useNavigate();

   return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src={logo} alt="Teletón" className="login-logo" />
      </header>

      <main className="login-page">
        <LoginForm onSubmit={async (email, password) => {
          try {
            await loginUsuario(email, password);
            navigate('/home');
          } catch(e) {
            alert(e);
          }
        }} />
      </main>
    </div>
  );
};

export default Login;

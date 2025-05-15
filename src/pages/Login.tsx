import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css';
import logo from '../assets/teleton-logo.png';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/usuarioService';
import { useEffect } from 'react';

const Login: React.FC = () => {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Grafomotor IA | Iniciar sesión';
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

   return (
    <div className="login-wrapper">
      <header className="login-header">
        <div className='logo'>
          <img src={logo} alt="Teletón" className="login-logo" />
          <hr className='linea'/>
          <p className='nombre-logo'>Grafomotor IA</p>
        </div>
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

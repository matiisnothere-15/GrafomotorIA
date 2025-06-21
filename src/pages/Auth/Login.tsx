import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import Header from '../../components/Header';
import '../Auth/Login.css';
import { loginUsuario } from '../../services/usuarioService';


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
      <Header />

      <main className="login-page">
        <LoginForm
          onSubmit={async (email, password) => {
            try {
              await loginUsuario(email, password);
              navigate('/home');
            } catch (e: any) {
              alert(e.message || 'Error al iniciar sesión');
            }
          }}
        />
      </main>
    </div>
  );
};

export default Login;

import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css';
import logo from '../assets/teleton-logo.png'; // asegúrate de tener la imagen en esa ruta

const Login: React.FC = () => {
  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src={logo} alt="Teletón" className="login-logo" />
      </header>

      <main className="login-page">
        <LoginForm onSubmit={() => {}} />
      </main>
    </div>
  );
};

export default Login;

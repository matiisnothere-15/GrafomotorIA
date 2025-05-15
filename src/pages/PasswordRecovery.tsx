import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import './PasswordRecovery.css';
import logo from '../assets/teleton-logo.png';

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    document.title = 'Grafomotor IA | Recuperar contraseña';
  },[]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnimando(true);

    // Esperar a que se vea la animación fade-out
    setTimeout(() => {
      setEnviado(true);
      setAnimando(false);
    }, 400);
  };

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
        <div className="recovery-form">
          <h2>Recuperar Contraseña</h2>

          {!enviado ? (
            <form
              onSubmit={handleSubmit}
              className={animando ? 'fade-out' : 'fade-in'}
            >
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Enviar enlace</button>
            </form>
          ) : (
            <div className="success-message fade-in">
              <div className="icon-success">📧</div>
              <h3>¡Correo enviado!</h3>
              <p>
                Revisa tu bandeja de entrada para continuar con la recuperación de tu contraseña.
              </p>
              <Link to="/" className="back-to-login">
                Volver al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PasswordRecovery;

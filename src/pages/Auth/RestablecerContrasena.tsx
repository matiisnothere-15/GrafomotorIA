import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header'; 
import './Login.css';

const RestablecerContrasena: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 

  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // se agregará la lógica real 
    console.log('Formulario válido. Token:', token);
  };

  return (
    <div className="login-wrapper">
      <Header /> 

      <main className="login-page">
        <div className="recovery-form">
          <h2>Restablecer Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              required
            />
            <button type="submit">Cambiar contraseña</button>
          </form>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default RestablecerContrasena;

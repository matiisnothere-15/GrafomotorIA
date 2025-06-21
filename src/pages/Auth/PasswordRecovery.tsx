import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { enviarCodigo, verificarCodigo, cambiarContrasena } from '../../services/usuarioService';
import './Login.css';
import './PasswordRecovery.css';


const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [animando, setAnimando] = useState(false);

  const [verificado, setVerificado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [newcontrasena, setNewcontrasena] = useState('');

  const navigate = useNavigate();
  const [botonEnviar, setBotonEnviar] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Grafomotor IA | Recuperar contraseña';
  },[]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Enviando codigo de recuperacion al correo
    try {
      setBotonEnviar(false);
      const res = await enviarCodigo(email);
      setBotonEnviar(true);

      if(!res) {
        alert('Error al enviar código, intente más tarde');
        return;
      }

      if(res.msg) {
        alert(res.msg);
        return;
      }

      // Esperar a que se vea la animación fade-out
      setAnimando(true);
      setTimeout(() => {
        setEnviado(true);
        setAnimando(false);
      }, 400);

    } catch(e) {
      console.log(e);
      alert("Error al enviar código, intente más tarde")
    }
  };

  const handleSubmitCodigo = async (e: React.FormEvent) => {
    e.preventDefault();

    //Verificando código
    try {
      setBotonEnviar(false);
      const res = await verificarCodigo(email, codigo);
      setBotonEnviar(true);

      if(!res) {
        alert('Error al verificar el código, intente más tarde');
        return;
      }

      if(res.msg) {
        alert(res.msg);
        return;
      }

      setVerificado(true);
    } catch(e) {
      console.log(e);
      alert('Error al verificar el código, intente más tarde');
    }
  };

  const handleSubmitContrasena = async (e: React.FormEvent) => {
    e.preventDefault();

    //Cambiando la contrasena
    try {
      if (contrasena !== newcontrasena) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      setBotonEnviar(false);
      const res = await cambiarContrasena(email, newcontrasena);
      setBotonEnviar(true);

      if(!res) {
        alert('Error al cambiar la contraseña, intente más tarde');
        return;
      }

      if(res.msg) {
        alert(res.msg);
        return;
      }

      alert('Contraseña actualizada, ya puedes iniciar sesión.');
      navigate('/');
    } catch(e) {
      console.log(e);
      alert('Error al cambiar la contraseña, intente más tarde');
    }

  };

  return (
    <div className="login-wrapper">
      <Header />

      {!verificado ? (
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
                {botonEnviar ? (
                  <button type="submit">Enviar código</button>
                ) : (
                  <button type="submit" disabled style={{opacity: 0.5, cursor: "default"}}>Cargando...</button>
                )}
              </form>
            ) : (
              <div className="success-message fade-in">
                <div className="icon-success">📧</div>
                <h3>¡Correo enviado!</h3>
                <p>
                  A continuación, ingresa el código de verificación que te hemos enviado.
                </p>
                <form
                  onSubmit={handleSubmitCodigo}
                  className={'fade-in'}
                >
                  <input
                    type="text"
                    placeholder="Código"
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                  />
                  {botonEnviar ? (
                    <button type="submit">Verificar código</button>
                  ) : (
                    <button type="submit" disabled style={{opacity: 0.5, cursor: "default"}}>Cargando...</button>
                  )}
                </form>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="login-page">
          <div className="recovery-form">
            <h2>Cambiar contraseña</h2>

            <form
              onSubmit={handleSubmitContrasena}
              className={'fade-in'}
            >
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={newcontrasena}
                onChange={(e) => setNewcontrasena(e.target.value)}
                required
              />
              {botonEnviar ? (
                <button type="submit">Cambiar contraseña</button>
              ) : (
                <button type="submit" disabled style={{opacity: 0.5, cursor: "default"}}>Cargando...</button>
              )}
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </main>
      )} 
      
    </div>
  );
};

export default PasswordRecovery;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import './Sesion.css';

const Sesion: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [nivelLogro, setNivelLogro] = useState(0);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertaVisible(true);
    setTimeout(() => setAlertaVisible(false), 5000);
    setNombre('');
    setFecha('');
    setObservaciones('');
    setNivelLogro(0);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  useEffect(() => {
    const cerrarConEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarMenu();
    };
    document.addEventListener('keydown', cerrarConEscape);
    return () => document.removeEventListener('keydown', cerrarConEscape);
  }, []);

  const opciones = [
    { icono: '📄', texto: 'Ver Sesiones', ruta: '/ver-sesiones' },
    { icono: '📝', texto: 'Evaluaciones', ruta: '/evaluaciones' },
    { icono: '📊', texto: 'Progreso', ruta: '/progreso' },
    { icono: '🏠', texto: 'Volver al Inicio', ruta: '/' }
  ];

  return (
    <div className="home-wrapper">
      <Header />

      <button className="menu-button" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? '✖' : '☰'}
      </button>

      {menuAbierto && <div className="menu-overlay" onClick={cerrarMenu}></div>}

      <div className={`sidebar ${menuAbierto ? 'abierto' : ''}`}>
        <div className="sidebar-opciones">
          {opciones.map((item, index) => (
            <Link
              to={item.ruta}
              className="sidebar-opcion"
              key={index}
              onClick={cerrarMenu}
            >
              <span className="emoji">{item.icono}</span>
              {item.texto}
            </Link>
          ))}
        </div>
      </div>

      <main className="home-content">
        <div className="sesion-form-container">
          {alertaVisible && (
            <div className="alerta-central">✅ ¡Sesión registrada con éxito!</div>
          )}
          <h2 className="sesion-titulo">Registrar Sesión</h2>
          <form onSubmit={handleSubmit} className="sesion-form">
            <div className="sesion-row">
              <div className="campo">
                <label>Nombre del paciente</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="campo">
                <label>Fecha y hora</label>
                <input
                  type="datetime-local"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="campo">
              <label>Observaciones</label>
              <textarea
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                required
              />
            </div>
            <div className="campo">
              <label>Nivel de logro</label>
              <div className="estrellas">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`estrella ${n <= nivelLogro ? 'activa' : ''}`}
                    onClick={() => setNivelLogro(n === nivelLogro ? 0 : n)}
                  >
                    {n <= nivelLogro ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-registrar">Registrar</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Sesion;

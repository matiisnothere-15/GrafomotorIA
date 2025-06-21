import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Configuracion.css';

const Configuracion: React.FC = () => {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);
  const [formatoHora, setFormatoHora] = useState<'12h' | '24h'>('24h');
  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const [autoLogout, setAutoLogout] = useState(15);

  useEffect(() => {
    const stored = localStorage.getItem('config');
    if (stored) {
      const config = JSON.parse(stored);
      setModoOscuro(config.modoOscuro);
      setNotificaciones(config.notificaciones);
      setFormatoHora(config.formatoHora);
      setIdioma(config.idioma);
      setAutoLogout(config.autoLogout);
      document.body.classList.toggle('dark-mode', config.modoOscuro);
    }
  }, []);

  const handleGuardar = () => {
    const nuevaConfig = {
      modoOscuro,
      notificaciones,
      formatoHora,
      idioma,
      autoLogout
    };
    localStorage.setItem('config', JSON.stringify(nuevaConfig));
    document.body.classList.toggle('dark-mode', modoOscuro);
    alert('Configuración guardada');
  };

  const handleReset = () => {
    localStorage.removeItem('config');
    window.location.reload();
  };

  return (
    <div className="config-wrapper">
      <Header />
      <main className="config-content">
        <div className="config-form">
          <h2 className="titulo-config">Configuración</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGuardar(); }}>
            <div className="form-group">
              <label>Modo oscuro:</label>
              <input type="checkbox" checked={modoOscuro} onChange={(e) => setModoOscuro(e.target.checked)} />
            </div>

            <div className="form-group">
              <label>Notificaciones:</label>
              <input type="checkbox" checked={notificaciones} onChange={(e) => setNotificaciones(e.target.checked)} />
            </div>

            <div className="form-group">
              <label>Formato de hora:</label>
              <select value={formatoHora} onChange={(e) => setFormatoHora(e.target.value as '12h' | '24h')}>
                <option value="12h">12 horas</option>
                <option value="24h">24 horas</option>
              </select>
            </div>

            <div className="form-group">
              <label>Idioma:</label>
              <select value={idioma} onChange={(e) => setIdioma(e.target.value as 'es' | 'en')}>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>

            <div className="form-group">
              <label>Auto-cierre de sesión (min):</label>
              <input type="number" value={autoLogout} onChange={(e) => setAutoLogout(parseInt(e.target.value))} min={1} max={120} />
            </div>

            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-reset" onClick={handleReset}>Restablecer ajustes</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Configuracion;

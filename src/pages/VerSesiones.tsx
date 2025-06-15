import React from 'react';
import './VerSesiones.css';

interface Sesion {
  id: number;
  paciente: string;
  fechaHora: string; // ISO string
  observaciones: string;
  nivelLogro: number; // 0-5
}

const sesionesEjemplo: Sesion[] = [
  {
    id: 1,
    paciente: 'Juan Pérez',
    fechaHora: '2025-06-01T10:00:00',
    observaciones: 'Mejoró coordinación en ejercicios',
    nivelLogro: 4,
  },
  {
    id: 2,
    paciente: 'María González',
    fechaHora: '2025-06-03T15:30:00',
    observaciones: 'Necesita apoyo adicional en trazos',
    nivelLogro: 3,
  },
  {
    id: 3,
    paciente: 'Luis Rodríguez',
    fechaHora: '2025-06-05T09:00:00',
    observaciones: 'Avances significativos',
    nivelLogro: 5,
  },
];

const VerSesiones: React.FC = () => {
  return (
    <div className="ver-sesiones-wrapper">
      <h1 className="titulo-sesiones">Sesiones Registradas</h1>
      <div className="sesiones-lista">
        {sesionesEjemplo.map((sesion) => (
          <div key={sesion.id} className="sesion-card">
            <div className="sesion-header">
              <span className="sesion-nombre">{sesion.paciente}</span>
              <span className="sesion-fecha">
                {new Date(sesion.fechaHora).toLocaleString()}
              </span>
            </div>
            <p className="sesion-observaciones">{sesion.observaciones}</p>
            <div className="sesion-logro" aria-label={`Nivel de logro: ${sesion.nivelLogro} de 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < sesion.nivelLogro ? 'estrella llena' : 'estrella'}>
                  {i < sesion.nivelLogro ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerSesiones;
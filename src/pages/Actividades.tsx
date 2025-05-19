import React, { useEffect } from 'react';
import './Login.css';
import './Activity.css';
import Header from '../components/Header';

// Importa imágenes desde assets
import figura from '../assets/ejercicios/copia-figuras.png';
import trazado from '../assets/ejercicios/trazado-guiado.png';
import toque from '../assets/ejercicios/toque-secuencial.png';
import seleccion from '../assets/ejercicios/seleccion-guiada.png';
import conexiones from '../assets/ejercicios/conexiones.png';
import laberinto from '../assets/ejercicios/seguir-laberinto.png';

// Lista de actividades
const actividades = [
  { nombre: 'Copia de Figuras', icono: figura, categoria: 'Motricidad Fina' },
  { nombre: 'Trazado Guiado', icono: trazado, categoria: 'Motricidad Fina' },
  { nombre: 'Toque secuencial', icono: toque, categoria: 'Visomotor' },
  { nombre: 'Seleccion Guiada', icono: seleccion, categoria: 'Visomotor' },
  { nombre: 'Conexiones', icono: conexiones, categoria: 'Motricidad Fina' },
  { nombre: 'Seguir Laberinto', icono: laberinto, categoria: 'Motricidad Fina' },
];

const Actividades: React.FC = () => {
  useEffect(() => {
    document.title = 'Grafomotor IA | Actividades';
  }, []);

  return (
    <div className="home-wrapper">
      <Header />

      <main className="home-content">
        <div className="activity-grid">
          {actividades.map((actividad, index) => (
            <div className="activity-card" key={index}>
              <h3 className="activity-title">{actividad.nombre}</h3>
              <img
                src={actividad.icono}
                alt={actividad.nombre}
                className="activity-icon"
              />
              <span
                className={`activity-tag ${actividad.categoria
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}
              >
                {actividad.categoria}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Actividades;

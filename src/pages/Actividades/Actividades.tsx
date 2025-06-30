import React, { useEffect } from 'react';
import '../Auth/Login.css';
import './Actividades.css';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

import figura from '../../assets/ejercicios/copia-figuras.png';
import trazado from '../../assets/ejercicios/trazado-guiado.png';
import toque from '../../assets/ejercicios/toque-secuencial.png';
import seleccion from '../../assets/ejercicios/seleccion-guiada.png';
import conexiones from '../../assets/ejercicios/conexiones.png';
import laberinto from '../../assets/ejercicios/seguir-laberinto.png';

const actividades = [
  { nombre: 'Copia de Figuras', icono: figura, categoria: 'Motricidad Fina', ruta: '/figuras' },
  { nombre: 'Trazado Guiado', icono: trazado, categoria: 'Motricidad Fina', ruta: '/actividad/trazado-guiado' },
  { nombre: 'Toque Secuencial', icono: toque, categoria: 'Visomotor', ruta: '/actividad/toque-secuencial' },
  { nombre: 'Selección Guiada', icono: seleccion, categoria: 'Visomotor' },
  { nombre: 'Conexiones', icono: conexiones, categoria: 'Motricidad Fina' },
  { nombre: 'Seguir Laberinto', icono: laberinto, categoria: 'Motricidad Fina' },
];

const Actividades: React.FC = () => {
  useEffect(() => {
    document.title = 'Grafomotor IA | Actividades';
  }, []);

  return (
    <div className="activity-wrapper">
      <Header />

      <main className="home-content">
        <div className="activity-grid">
          {actividades.map((actividad, index) => {
            const card = (
              <div className="activity-card" key={index} tabIndex={0}>
                <h3 className="activity-title">{actividad.nombre}</h3>
                <img src={actividad.icono} alt={actividad.nombre} className="activity-icon" />
                <span className={`activity-tag ${actividad.categoria.replace(/\s+/g, '-').toLowerCase()}`}>
                  {actividad.categoria}
                </span>
              </div>
            );

            return actividad.ruta ? (
              <Link to={actividad.ruta} key={index} className="activity-card-link">
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Actividades;

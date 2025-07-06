import React, { useEffect } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import './SeleccionFigura.css';

import circulo from '../../assets/figuras/circulo.png';
import cuadrado from '../../assets/figuras/cuadrado.png';
import triangulo from '../../assets/figuras/triangulo.png';
import estrella from '../../assets/figuras/estrella.png';
import flecha from '../../assets/figuras/flecha.png';
import pacman from '../../assets/figuras/pacman.png';
import infinito from '../../assets/figuras/infinito.png';
import arbol from '../../assets/figuras/arbol.png';
import nube from '../../assets/figuras/nube.png';

const figuras = [
  { nombre: 'Círculo', icono: circulo, nivel: 1, id: 'circulo' },
  { nombre: 'Cuadrado', icono: cuadrado, nivel: 1, id: 'cuadrado' },
  { nombre: 'Triángulo', icono: triangulo, nivel: 1, id: 'triangulo' },
  { nombre: 'Estrella', icono: estrella, nivel: 2, id: 'estrella' },
  { nombre: 'Flecha', icono: flecha, nivel: 2, id: 'flecha' },
  { nombre: 'Pacman', icono: pacman, nivel: 2, id: 'pacman' },
  { nombre: 'Infinito', icono: infinito, nivel: 3, id: 'infinito' },
  { nombre: 'Arbol', icono: arbol, nivel: 3, id: 'arbol' },
  { nombre: 'Nube', icono: nube, nivel: 3, id: 'nube' },
];

const SeleccionFigura: React.FC = () => {
  useEffect(() => {
    document.title = 'Selecciona una Figura';
  }, []);

  return (
    <div className="seleccionfigura-wrapper">
      <Header />
      <main>
        <div className="seleccionfigura-grid">
          {figuras.map((figura) => {
            const ruta = `/copiar-figura/nivel${figura.nivel}/${figura.id}`;

            return (
              <Link to={ruta} key={figura.nombre} className="activity-card-link">
                <div className="seleccionfigura-card" tabIndex={0}>
                  <h3>{figura.nombre}</h3>
                  <img src={figura.icono} alt={figura.nombre} />
                  <span className="nivel-tag">Nivel {figura.nivel}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SeleccionFigura;

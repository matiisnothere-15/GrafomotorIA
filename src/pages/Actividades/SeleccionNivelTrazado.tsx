import React, { useEffect } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import './SeleccionFigura.css';

import curvasE from '../../assets/trazados/curvasE.png';
import dobleEspiral from '../../assets/trazados/doble-espiral.png';
import espiral from '../../assets/trazados/espiral.png';
import montaña from '../../assets/trazados/montaña.png';
import ola from '../../assets/trazados/ola.png';
import ondas from '../../assets/trazados/ondas.png';
import punteagudo from '../../assets/trazados/punteagudo.png';
import caminocurva from '../../assets/trazados/caminocurva.png';
import zigzagEspiral from '../../assets/trazados/zigzag_espiral.png';


const trazados = [
  { nombre: 'Montaña', icono: montaña, nivel: 1, id: 'montaña' },
  { nombre: 'Ondas', icono: ondas, nivel: 1, id: 'ondas' },
  { nombre: 'Ola', icono: ola, nivel: 1, id: 'ola' },
  { nombre: 'Punteado Agudo', icono: punteagudo, nivel: 2, id: 'punteagudo' },
  { nombre: 'Camino Curva', icono: caminocurva, nivel: 2, id: 'caminocurva' },
  { nombre: 'Espiral', icono: espiral, nivel: 2, id: 'espiral' },
  { nombre: 'Curvas Enfrentadas', icono: curvasE, nivel: 3, id: 'curvasE' },
  { nombre: 'Doble Espiral', icono: dobleEspiral, nivel: 3, id: 'doble_espiral' },
  { nombre: 'Zigzag con Espiral', icono: zigzagEspiral, nivel: 3, id: 'zigzag_espiral' },
];


const SeleccionTrazado: React.FC = () => {
  useEffect(() => {
    document.title = 'Selecciona un Trazado';
  }, []);

  return (
    <div className="seleccionfigura-wrapper">
      <Header />
      <main>
        <div className="seleccionfigura-grid">
          {trazados.map((trazo) => {
            const ruta = `/trazado-guiado/nivel${trazo.nivel}/${trazo.id}`;

            return (
              <Link to={ruta} key={trazo.nombre} className="activity-card-link">
                <div className="seleccionfigura-card" tabIndex={0}>
                  <h3>{trazo.nombre}</h3>
                  <img src={trazo.icono} alt={trazo.nombre} />
                  <span className="nivel-tag">Nivel {trazo.nivel}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SeleccionTrazado;

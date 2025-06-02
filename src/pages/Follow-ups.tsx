import React from 'react';
import Header from '../components/Header';
import './Follow-ups.css';
import { FaUserCircle } from 'react-icons/fa';
import figura from '../assets/ejercicios/copia-figuras.png';
import laberinto from '../assets/ejercicios/seguir-laberinto.png';

const aciertosEjercicio = [
  { nombre: 'Trazado Guiado', porcentaje: 75 },
  { nombre: 'Seguir Laberinto', porcentaje: 84 },
  { nombre: 'Toque Secuencial', porcentaje: 73 },
  { nombre: 'Copia de Figuras', porcentaje: 40 },
];

const progresoTratamiento = [
  { nombre: 'Motricidad fina', porcentaje: 99 },
  { nombre: 'Estimulación sensorial', porcentaje: 88 },
  { nombre: 'Grafomotricidad', porcentaje: 75 },
  { nombre: 'Visomotora', porcentaje: 84 },
];

const Seguimientos: React.FC = () => {
  const aciertoTotal = 75;

  return (
    <div className="seguimientos-wrapper">
      <Header />
      <main className="seguimientos-content">
        <h2 className="titulo-vista">Seguimiento de Progreso</h2>

        <div className="seguimiento-grid">
          {/* FILA SUPERIOR */}
          <div className="card linea">
            <h3>Progreso del Paciente</h3>
            <div className="grafico-lineas">[Gráfico dinámico aquí]</div>
            <div className="leyenda">
              <span className="leyenda-azul">Motricidad</span>
              <span className="leyenda-rojo">Lenguaje</span>
              <span className="leyenda-naranjo">Coordinación visomotora</span>
            </div>
          </div>

          <div className="card barras-ejercicio">
            <h3>Porcentaje de acierto por ejercicio</h3>
            <ul>
              {aciertosEjercicio.map((ej, i) => (
                <li key={i}>
                  <span>{ej.nombre}</span>
                  <div
                    className={`barra barra-${ej.porcentaje} ${
                      ej.porcentaje < 60 ? 'rojo' : ej.porcentaje < 85 ? 'naranja' : ''
                    }`}
                    style={{ width: `${ej.porcentaje}%` }}
                  >
                    {ej.porcentaje}%
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card circulo-total">
            <h3>Porcentaje de acierto total</h3>
            <div
              className="circulo"
              style={{
                background: `conic-gradient(var(--color-verde) ${aciertoTotal}%, #ccc 0)`
              }}
            >
              {aciertoTotal}%
            </div>
            <p className="leyenda-circulo">+60%: bien • -60%: alerta</p>
          </div>

          {/* FILA INFERIOR */}
          <div className="card rendimiento-reciente">
            <h3>Rendimiento Reciente</h3>
            <div className="rendimiento-simple">
              <div>
                <p>Fortalezas</p>
                <img src={laberinto} alt="fortaleza" />
                <span>Seguir Laberinto</span>
              </div>
              <div>
                <p>Dificultades</p>
                <img src={figura} alt="dificultad" />
                <span>Copia de Figuras</span>
              </div>
            </div>
          </div>

          <div className="card progreso-barras">
            <h3>Progreso del Tratamiento</h3>
            <ul>
              {progresoTratamiento.map((item, i) => (
                <li key={i}>
                  <span>{item.nombre}</span>
                  <div
                    className={`barra barra-${item.porcentaje} ${
                      item.porcentaje < 60 ? 'rojo' : item.porcentaje < 85 ? 'naranja' : ''
                    }`}
                    style={{ width: `${item.porcentaje}%` }}
                  >
                    {item.porcentaje}%
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card ficha-paciente">
            <FaUserCircle className="icono-usuario" />
            <h3>Me llamo Ryan</h3>
            <p>TEA</p>
            <p>Nivel de Autonomía</p>
            <div className="autonomia moderado">Moderado</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Seguimientos;

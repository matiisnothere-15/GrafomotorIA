import React from 'react';
import Header from '../components/Header';
import './Follow-ups.css';
import { FaUserCircle } from 'react-icons/fa';
import figura from '../assets/ejercicios/copia-figuras.png';
import laberinto from '../assets/ejercicios/seguir-laberinto.png';
const Seguimientos: React.FC = () => {
  return (
    <div className="seguimientos-wrapper">
      <Header />
      <main className="seguimientos-content">
        <h2 className="titulo-vista">Seguimiento de Progreso</h2>

        <div className="seguimiento-grid">

          {/* FILA SUPERIOR */}
          <div className="card linea">
            <h3>Progreso del Paciente</h3>
            <div className="grafico-lineas">[Gráfico líneas]</div>
            <div className="leyenda">
              <span className="leyenda-azul">Motricidad</span>
              <span className="leyenda-rojo">Lenguaje</span>
              <span className="leyenda-naranjo">Coordinación visomotora</span>
            </div>
          </div>

          <div className="card barras-ejercicio">
            <h3>Porcentaje de acierto por ejercicio</h3>
            <ul>
              <li><span>Trazado Guiado</span><div className="barra barra-75">75%</div></li>
              <li><span>Seguir Laberinto</span><div className="barra barra-84">84%</div></li>
              <li><span>Toque Secuencial</span><div className="barra barra-73">73%</div></li>
              <li><span>Copia de Figuras</span><div className="barra barra-40 rojo">40%</div></li>
            </ul>
          </div>

          <div className="card circulo-total">
            <h3>Porcentaje de acierto total</h3>
            <div className="circulo">75%</div>
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
              <li><span>Comunicación</span><div className="barra barra-50 rojo">50%</div></li>
              <li><span>Motricidad fina</span><div className="barra barra-99 naranja">99%</div></li>
              <li><span>Estimulación sensorial</span><div className="barra barra-88">88%</div></li>
              <li><span>Grafomotricidad</span><div className="barra barra-75">75%</div></li>
              <li><span>Atención</span><div className="barra barra-46 rojo">46%</div></li>
              <li><span>Visomotora</span><div className="barra barra-84">84%</div></li>
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

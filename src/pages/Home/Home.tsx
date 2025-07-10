import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Auth/Login.css';
import './Home.css';
import Header from '../../components/Header'; 
import {
  FaCalendarAlt,
  FaDumbbell,
  FaClipboardList,
  FaTasks,
  FaChartLine,
  FaInfoCircle
} from 'react-icons/fa';

const opciones = [
  { icono: <FaClipboardList />, texto: 'Sesiones', ruta: '/Sesion' },
  { icono: <FaCalendarAlt />, texto: 'Calendario y citas', ruta: '/Calendario' },
  { icono: <FaDumbbell />, texto: 'Biblioteca de ejercicios', ruta: '/actividades' },
  { icono: <FaTasks />, texto: 'Planes de tratamiento', ruta: '/PlanTratamiento' },
  { icono: <FaChartLine />, texto: 'Seguimiento y progresos', ruta: '/Seguimientos' },
  { icono: <FaInfoCircle />, texto: 'Contactanos', ruta: '/contactanos' }
];

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Grafomotor IA | Inicio';
  }, []);

  return (
    <div className="home-wrapper">
      <Header />
      <main className="home-content">
        <div className="home-grid">
          {opciones.map((item, index) => (
            <Link to={item.ruta} className="home-card" key={index}>
              <div className="card-circle">{item.icono}</div>
              <span className="card-texto">{item.texto}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
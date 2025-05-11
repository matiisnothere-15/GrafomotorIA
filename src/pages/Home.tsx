import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Fondo y header
import './Home.css';
import logo from '../assets/teleton-logo.png';
import {
  FaCalendarAlt,
  FaDumbbell,
  FaClipboardList,
  FaTasks,
  FaChartLine,
  FaFileAlt,
  FaInfoCircle
} from 'react-icons/fa';

const opciones = [
  { icono: <FaClipboardList />, texto: 'Sesiones', ruta: '/sesiones' },
  { icono: <FaCalendarAlt />, texto: 'Calendario y citas', ruta: '/citas' },
  { icono: <FaDumbbell />, texto: 'Biblioteca de ejercicios', ruta: '/ejercicios' },
  { icono: <FaTasks />, texto: 'Planes de tratamiento', ruta: '/planes' },
  { icono: <FaChartLine />, texto: 'Seguimiento y progresos', ruta: '/seguimiento' },
  { icono: <FaFileAlt />, texto: 'Reportes e informes', ruta: '/reportes' },
  { icono: <FaInfoCircle />, texto: 'Ayuda y soporte', ruta: '/ayuda' }
];

const Home: React.FC = () => {
  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src={logo} alt="Teletón" className="login-logo" />
      </header>

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

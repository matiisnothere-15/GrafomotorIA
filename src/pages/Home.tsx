import React, { useState, useRef, useEffect } from 'react';
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
  FaInfoCircle,
  FaUserCircle,
  FaUser,
  FaCog
} from 'react-icons/fa';

const opciones = [
  { icono: <FaClipboardList />, texto: 'Sesiones', ruta: '/sesiones' },
  { icono: <FaCalendarAlt />, texto: 'Calendario y citas', ruta: '/citas' },
  { icono: <FaDumbbell />, texto: 'Biblioteca de ejercicios', ruta: '/actividades' },
  { icono: <FaTasks />, texto: 'Planes de tratamiento', ruta: '/planes' },
  { icono: <FaChartLine />, texto: 'Seguimiento y progresos', ruta: '/seguimiento' },
  { icono: <FaFileAlt />, texto: 'Reportes e informes', ruta: '/reportes' },
  { icono: <FaInfoCircle />, texto: 'Ayuda y soporte', ruta: '/ayuda' }
];

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src={logo} alt="Teletón" className="login-logo" />
        <div className="user-container" ref={dropdownRef}>
          <div className="user-label" onClick={() => setMenuOpen(!menuOpen)}>
            <span>Hola, {sessionStorage.getItem("nombre") || "Usuario"}</span>
            <FaUserCircle className="user-icon" />
          </div>
          {menuOpen && (
            <div className="user-dropdown">
              <Link to="/perfil">
                <FaUser /> Perfil
              </Link>
              <Link to="/ajustes">
                <FaCog /> Ajustes
              </Link>
            </div>
          )}
        </div>
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

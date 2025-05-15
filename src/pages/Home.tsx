import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { RiLogoutBoxLine } from "react-icons/ri";

const opciones = [
  { icono: <FaClipboardList />, texto: 'Sesiones', ruta: 'sesiones' },
  { icono: <FaCalendarAlt />, texto: 'Calendario y citas', ruta: 'citas' },
  { icono: <FaDumbbell />, texto: 'Biblioteca de ejercicios', ruta: 'actividades' },
  { icono: <FaTasks />, texto: 'Planes de tratamiento', ruta: 'planes' },
  { icono: <FaChartLine />, texto: 'Seguimiento y progresos', ruta: 'seguimiento' },
  { icono: <FaFileAlt />, texto: 'Reportes e informes', ruta: 'reportes' },
  { icono: <FaInfoCircle />, texto: 'Ayuda y soporte', ruta: 'ayuda' }
];

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    document.title = 'Grafomotor IA | Inicio';
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
    <div className="home-wrapper">
      <header className="login-header">
        <div className='logo'>
          <img src={logo} alt="Teletón" className="login-logo" />
          <hr className='linea'/>
          <p className='nombre-logo'>Grafomotor IA</p>
        </div>
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
              <button onClick={handleLogout} className="logout">
                <RiLogoutBoxLine /> Salir
              </button>
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

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import './Activity.css';
import logo from '../assets/teleton-logo.png';
import {
  FaUserCircle,
  FaUser,
  FaCog
} from 'react-icons/fa';
import { RiLogoutBoxLine } from "react-icons/ri";

// 🖼️ Importa imágenes desde assets
import figura from '../assets/ejercicios/copia-figuras.png';
import trazado from '../assets/ejercicios/trazado-guiado.png';
import toque from '../assets/ejercicios/toque-secuencial.png';
import seleccion from '../assets/ejercicios/seleccion-guiada.png';
import conexiones from '../assets/ejercicios/conexiones.png';
import laberinto from '../assets/ejercicios/seguir-laberinto.png';


// 📦 Lista de actividades
const actividades = [
  { nombre: 'Copia de Figuras', icono: figura, categoria: 'Motricidad Fina' },
  { nombre: 'Trazado Guiado', icono: trazado, categoria: 'Motricidad Fina' },
  { nombre: 'Toque secuencial', icono: toque, categoria: 'Visomotor' },
  { nombre: 'Seleccion Guiada', icono: seleccion, categoria: 'Visomotor' },
  { nombre: 'Conexiones', icono: conexiones, categoria: 'Motricidad Fina' },
  { nombre: 'Seguir Laberinto', icono: laberinto, categoria: 'Motricidad Fina' },
];

const Actividades: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    document.title = 'Grafomotor IA | Actividades';
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
        <div className="activity-grid">
          {actividades.map((actividad, index) => (
            <div className="activity-card" key={index}>
                <h3 className="activity-title">{actividad.nombre}</h3>       {/* Nombre arriba */}
                <img src={actividad.icono} alt={actividad.nombre} className="activity-icon" /> {/* Ícono al medio */}
                <span className={`activity-tag ${actividad.categoria.replace(/\s+/g, '-').toLowerCase()}`}>
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

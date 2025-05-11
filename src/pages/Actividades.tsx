import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import './Activity.css';
import logo from '../assets/teleton-logo.png';
import {
  FaUserCircle,
  FaUser,
  FaCog
} from 'react-icons/fa';

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
            <span>Hola, usuario</span>
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

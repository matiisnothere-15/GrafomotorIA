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
  FaInfoCircle,
  FaCog,
  FaUserMd
} from 'react-icons/fa';

const opcionesAdministrador = [
  { icono: <FaClipboardList />, texto: 'Sesiones', ruta: '/Sesion' },
  { icono: <FaCalendarAlt />, texto: 'Calendario y citas', ruta: '/Calendario' }
];

const opcionesTerapeuta = [
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
        
        {/* Sección Administrador */}
        <div className="categoria-seccion admin-seccion">
          <div className="categoria-header">
            <h2 className="categoria-titulo admin-titulo">
              <FaCog className="categoria-icono" />
              Administrador
            </h2>
          </div>
          <div className="home-grid admin-grid">
            {opcionesAdministrador.map((item, index) => (
              <Link to={item.ruta} className="home-card admin-card" key={`admin-${index}`}>
                <div className="card-circle admin-circle">{item.icono}</div>
                <span className="card-texto">{item.texto}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sección Terapeuta */}
        <div className="categoria-seccion terapeuta-seccion">
          <div className="categoria-header">
            <h2 className="categoria-titulo terapeuta-titulo">
              <FaUserMd className="categoria-icono" />
              Terapeuta
            </h2>
          </div>
          <div className="home-grid terapeuta-grid">
            {opcionesTerapeuta.map((item, index) => (
              <Link to={item.ruta} className="home-card terapeuta-card" key={`terapeuta-${index}`}>
                <div className="card-circle terapeuta-circle">{item.icono}</div>
                <span className="card-texto">{item.texto}</span>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
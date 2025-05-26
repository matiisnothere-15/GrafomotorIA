import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; 
import './AyudaSoporte.css';

const AyudaSoporte: React.FC = () => {
  const opciones = [
    { icono: '❓', texto: 'Preguntas Frecuentes', ruta: '/faq' },
    { icono: '📧', texto: 'Contacto', ruta: '/contacto' },
    { icono: '💬', texto: 'Comentarios', ruta: '/comentarios' }
  ];

  return (
    <div className="home-wrapper">
      <Header /> {/* Logo + nombre + usuario */}

      <main className="home-content">
        <div className="home-grid">
          {opciones.map((item, index) => (
            <Link to={item.ruta} className="home-card" key={index}>
              <div className="card-circle">
                <span className="emoji">{item.icono}</span>
              </div>
              <span className="card-texto">{item.texto}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AyudaSoporte;

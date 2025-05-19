import React from 'react';
import { Link } from 'react-router-dom';
import './HomeCard.css';


interface Props {
  ruta: string;
 icono: React.ReactNode;
  texto: string;
}

const HomeCard: React.FC<Props> = ({ ruta, icono, texto }) => {
  return (
    <Link to={ruta} className="home-card">
      <div className="card-circle">{icono}</div>
      <span className="card-texto">{texto}</span>
    </Link>
  );
};

export default HomeCard;

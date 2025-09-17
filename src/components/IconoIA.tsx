import React from 'react';
import iconoIA from '../assets/icon-ia.png';
import './IconoIA.css';

interface IconoIAProps {
  size?: number;
  className?: string;
}

const IconoIA: React.FC<IconoIAProps> = ({ size = 20, className = '' }) => {
  return (
    <img 
      src={iconoIA} 
      alt="IA" 
      className={`icono-ia ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        objectFit: 'contain'
      }}
    />
  );
};

export default IconoIA;

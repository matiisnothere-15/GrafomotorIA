import React from 'react';
import './CircularProgressBar.css';

interface CircularProgressBarProps {
  percentage: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColor = 'var(--color-verde)'; // Verde por defecto
  if (percentage < 40) {
    strokeColor = 'var(--color-rojo)'; // Rojo si es bajo
  } else if (percentage < 70) {
    strokeColor = 'var(--color-secundario)'; // Amarillo si es medio
  }

  return (
    <div className="progress-circle-container">
      <svg className="progress-ring" width="200" height="200">
        <circle
          className="progress-ring__background"
          strokeWidth="20"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
        />
        <circle
          className="progress-ring__circle"
          strokeWidth="20"
          stroke={strokeColor}
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <span className="progress-text">{percentage}%</span>
    </div>
  );
};

export default CircularProgressBar;
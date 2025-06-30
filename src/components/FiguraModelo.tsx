import React, { useEffect } from 'react';


interface FiguraModeloProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  figura: [number, number][];
  color?: string;
  grosor?: number;
  relleno?: boolean;
}

const FiguraModelo: React.FC<FiguraModeloProps> = ({
  canvasRef,
  figura,
  color = '#aaaaaa',
  grosor = 20,
  relleno = false
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || figura.length === 0) return;

    ctx.beginPath();
    const [startX, startY] = figura[0];
    ctx.moveTo(startX, startY);
    figura.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();

    if (relleno) {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.stroke();
  }, [canvasRef, figura, color, grosor, relleno]);

  return null;
};

export default FiguraModelo;

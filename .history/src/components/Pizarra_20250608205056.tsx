import React, { useRef, useEffect, useState } from 'react';

interface Punto {
  x: number;
  y: number;
}

interface Props {
  color: string;
  colorModelo: string;
  background: string;
  lineWidth?: number;
  coordsModelo: [number, number][];
  cerrarModelo?: boolean;
  onFinishDraw: (coords: Punto[]) => void;
  onModeloTransformado?: (modelo: Punto[]) => void;
}

const Pizarra: React.FC<Props> = ({
  color,
  colorModelo,
  background,
  lineWidth = 3,
  coordsModelo,
  cerrarModelo = false,
  onFinishDraw,
  onModeloTransformado,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeloRef = useRef<HTMLCanvasElement>(null);
  const [dibujando, setDibujando] = useState(false);
  const [coords, setCoords] = useState<Punto[]>([]);

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  // Dibujo del modelo
  useEffect(() => {
    const canvas = modeloRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (!coordsModelo.length) return;

    const minX = Math.min(...coordsModelo.map(p => p[0]));
    const maxX = Math.max(...coordsModelo.map(p => p[0]));
    const minY = Math.min(...coordsModelo.map(p => p[1]));
    const maxY = Math.max(...coordsModelo.map(p => p[1]));

    const scaleX = (WIDTH * 0.8) / (maxX - minX);
    const scaleY = (HEIGHT * 0.8) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (WIDTH - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (HEIGHT - (maxY - minY) * scale) / 2 - minY * scale;

    const modeloTransformado: Punto[] = coordsModelo.map(([x, y]) => ({
      x: x * scale + offsetX,
      y: y * scale + offsetY,
    }));

    ctx.strokeStyle = colorModelo;
    ctx.lineWidth = 3;
    ctx.beginPath();
    modeloTransformado.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    if (cerrarModelo) ctx.closePath();
    ctx.stroke();

    if (onModeloTransformado) {
      onModeloTransformado(modeloTransformado);
    }
  }, [coordsModelo, cerrarModelo]);

  // Comienzo del trazo
  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const punto = getPunto(e);
    setDibujando(true);
    setCoords([punto]);
  };

  // Trazado continuo
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const punto = getPunto(e);
    setCoords(prev => {
      const nuevos = [...prev, punto];
      renderUserPath(nuevos);
      return nuevos;
    });
  };

  const endDraw = () => {
    setDibujando(false);
    onFinishDraw(coords);
  };

  const getPunto = (e: React.PointerEvent<HTMLCanvasElement>): Punto => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const renderUserPath = (puntos: Punto[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    puntos.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    setCoords([]);
  }, [coordsModelo]);

  return (
    <div
      className="pizarra-wrapper"
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
    >
      <canvas
        ref={modeloRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      />
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
        touch-action="none"
      />
    </div>
  );
};

export default Pizarra;

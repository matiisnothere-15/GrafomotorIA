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
  const coordsRef = useRef<Punto[]>([]);
  const [dibujando, setDibujando] = useState(false);

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  // Dibuja el modelo al fondo
  useEffect(() => {
    const canvas = modeloRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !coordsModelo.length) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const minX = Math.min(...coordsModelo.map(p => p[0]));
    const maxX = Math.max(...coordsModelo.map(p => p[0]));
    const minY = Math.min(...coordsModelo.map(p => p[1]));
    const maxY = Math.max(...coordsModelo.map(p => p[1]));

    const scaleX = (WIDTH * 0.8) / (maxX - minX);
    const scaleY = (HEIGHT * 0.8) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (WIDTH - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (HEIGHT - (maxY - minY) * scale) / 2 - minY * scale;

    const modeloTransformado = coordsModelo.map(([x, y]) => ({
      x: x * scale + offsetX,
      y: y * scale + offsetY,
    }));

    ctx.beginPath();
    ctx.moveTo(modeloTransformado[0].x, modeloTransformado[0].y);
    modeloTransformado.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    if (cerrarModelo) ctx.closePath();
    ctx.strokeStyle = colorModelo;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (onModeloTransformado) onModeloTransformado(modeloTransformado);
  }, [coordsModelo, cerrarModelo]);

  const getPunto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const punto = getPunto(e);
    coordsRef.current = [punto];
    setDibujando(true);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.beginPath();
    ctx.moveTo(punto.x, punto.y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const punto = getPunto(e);
    coordsRef.current.push(punto);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineTo(punto.x, punto.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const endDraw = () => {
    setDibujando(false);
    onFinishDraw(coordsRef.current);
  };

  // Limpiar trazos anteriores al cambiar modelo
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, WIDTH, HEIGHT);
    coordsRef.current = [];
  }, [coordsModelo]);

  return (
    <div className="pizarra-wrapper" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
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
      />
    </div>
  );
};

export default Pizarra;

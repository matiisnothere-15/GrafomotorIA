import React, { useRef, useEffect, useState } from 'react';

interface PizarraProps {
  color?: string;
  lineWidth?: number;
  background?: string;
  onFinishDraw?: (coords: { x: number; y: number }[]) => void;
  onModeloTransformado?: (coords: { x: number; y: number }[]) => void;
  coordsModelo?: [number, number][];
  colorModelo?: string;
  grosorModelo?: number;
  rellenarModelo?: boolean;
  cerrarTrazo?: boolean;
  debug?: boolean;
  suavizarModelo?: boolean; // NUEVO
}

const Pizarra: React.FC<PizarraProps> = ({
  color = 'black',
  lineWidth = 2,
  background = '#fff',
  onFinishDraw,
  onModeloTransformado,
  coordsModelo = [],
  colorModelo = '#aaaaaa',
  grosorModelo = 6,
  rellenarModelo = false,
  cerrarTrazo = true,
  debug = false,
  suavizarModelo = true // NUEVO
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const coordsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    ctx.scale(dpr, dpr);

    ctxRef.current = ctx;
    drawModeloCentrado(ctx);
  }, [coordsModelo, cerrarTrazo, grosorModelo, colorModelo, rellenarModelo, suavizarModelo]);

  const getBoundingBox = (coords: [number, number][]) => {
    const xs = coords.map(c => c[0]);
    const ys = coords.map(c => c[1]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  };

  const drawModeloCentrado = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (coordsModelo.length < 2) return;

    const bbox = getBoundingBox(coordsModelo);
    const modelWidth = bbox.maxX - bbox.minX;
    const modelHeight = bbox.maxY - bbox.minY;

    const scaleX = window.innerWidth * 0.6 / modelWidth;
    const scaleY = window.innerHeight * 0.6 / modelHeight;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (window.innerWidth - modelWidth * scale) / 2;
    const offsetY = (window.innerHeight - modelHeight * scale) / 2;

    const transformX = (x: number) => (x - bbox.minX) * scale + offsetX;
    const transformY = (y: number) => (y - bbox.minY) * scale + offsetY;

    const coordsTransformadas = coordsModelo.map(([x, y]) => ({
      x: transformX(x),
      y: transformY(y)
    }));

    ctx.beginPath();
    ctx.moveTo(coordsTransformadas[0].x, coordsTransformadas[0].y);

    if (suavizarModelo) {
      for (let i = 1; i < coordsTransformadas.length - 1; i++) {
        const p1 = coordsTransformadas[i];
        const p2 = coordsTransformadas[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }
      const last = coordsTransformadas[coordsTransformadas.length - 1];
      ctx.lineTo(last.x, last.y);
    } else {
      for (let i = 1; i < coordsTransformadas.length; i++) {
        const p = coordsTransformadas[i];
        ctx.lineTo(p.x, p.y);
      }
    }

    if (cerrarTrazo) ctx.closePath();

    if (rellenarModelo) {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
      ctx.fill();
    }

    ctx.strokeStyle = colorModelo;
    ctx.lineWidth = grosorModelo * (window.devicePixelRatio || 1);
    ctx.stroke();

    if (debug) {
      ctx.strokeStyle = 'rgba(0,0,255,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(offsetX, offsetY, modelWidth * scale, modelHeight * scale);
      ctx.fillStyle = 'rgba(255,0,0,0.5)';
      ctx.beginPath();
      ctx.arc(window.innerWidth / 2, window.innerHeight / 2, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (onModeloTransformado) onModeloTransformado(coordsTransformadas);
  };

  const getExactPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const pos = getExactPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    coordsRef.current = [pos];
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    const pos = getExactPos(e);
    const ctx = ctxRef.current;
    const prev = coordsRef.current[coordsRef.current.length - 1];
    if (prev) {
      const midX = (prev.x + pos.x) / 2;
      const midY = (prev.y + pos.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      ctx.stroke();
    }
    coordsRef.current.push(pos);
  };

  const stopDrawing = () => {
    if (cerrarTrazo) ctxRef.current?.closePath();
    setIsDrawing(false);
    if (onFinishDraw) onFinishDraw(coordsRef.current);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={stopDrawing}
      style={{
        width: '100vw',
        height: '100vh',
        background,
        touchAction: 'none',
        display: 'block'
      }}
    />
  );
};

export default Pizarra;

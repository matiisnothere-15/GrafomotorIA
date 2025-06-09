import React, { useRef, useEffect, useState } from 'react';

interface PizarraProps {
  color?: string;
  lineWidth?: number;
  background?: string;
  onFinishDraw?: (coords: { x: number; y: number }[]) => void;
  onModeloTransformado?: (coords: { x: number; y: number }[]) => void;
  coordsModelo?: [number, number][];
  colorModelo?: string;
}

const Pizarra: React.FC<PizarraProps> = ({
  color = 'black',
  lineWidth = 2,
  background = '#fff',
  onFinishDraw,
  onModeloTransformado,
  coordsModelo = [],
  colorModelo = '#aaaaaa'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const coordsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prepare = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctxRef.current = ctx;
      drawModeloCentrado(ctx);
    };

    ctxRef.current = ctx;
    drawModeloCentrado(ctx);
    prepare();
    window.addEventListener('resize', prepare);
    return () => window.removeEventListener('resize', prepare);
  }, [coordsModelo]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDrawing) stopDrawing();
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDrawing]);

  const getBoundingBox = (coords: [number, number][]) => {
    const xs = coords.map(p => p[0]);
    const ys = coords.map(p => p[1]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  };

  const drawModeloCentrado = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (coordsModelo.length < 2) return;

    const bbox = getBoundingBox(coordsModelo);
    const modelWidth = bbox.maxX - bbox.minX;
    const modelHeight = bbox.maxY - bbox.minY;

    const scale = Math.min(
      ctx.canvas.width * 0.6 / modelWidth,
      ctx.canvas.height * 0.6 / modelHeight
    );

    const offsetX = (ctx.canvas.width - modelWidth * scale) / 2;
    const offsetY = (ctx.canvas.height - modelHeight * scale) / 2;

    const transformX = (x: number) => (x - bbox.minX) * scale + offsetX;
    const transformY = (y: number) => (y - bbox.minY) * scale + offsetY;

    const coordsTransformadas = coordsModelo.map(([x, y]) => ({ x: transformX(x), y: transformY(y) }));

    ctx.beginPath();
    ctx.moveTo(coordsTransformadas[0].x, coordsTransformadas[0].y);
    coordsTransformadas.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.strokeStyle = '#aaaaaa';
    ctx.strokeStyle = colorModelo;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (onModeloTransformado) onModeloTransformado(coordsTransformadas);
  };

  const getExactPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
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
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
    coordsRef.current.push(pos);
  };

  const stopDrawing = () => {
    ctxRef.current?.closePath();
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
        width: '100%',
        height: '100%',
        background,
        touchAction: 'none',
        display: 'block'
      }}
    />
  );
};

export default Pizarra;
import React, { useState, useEffect } from 'react';
import Pizarra from '../../components/Pizarra';
import { modeloCirculo } from '../../components/FiguraModelo';
import type { EvaluacionEscala } from '../../models/EvaluacionEscala';
import { crearEvaluacionEscala } from '../../services/evaluacionEscalaService';
import Stars from '../../components/Stars';
import './CopiaFigura.css';

const CopiaFigura: React.FC = () => {
  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);
  const [modeloTransformado, setModeloTransformado] = useState<{ x: number; y: number }[]>([]);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);

  const handleFinishDraw = (puntos: { x: number; y: number }[]) => {
    setCoords(puntos);
  };

  useEffect(() => {
    if (coords.length > 0 && modeloTransformado.length > 0) {
      calcularPrecision(coords, modeloTransformado);
    }
  }, [coords, modeloTransformado]);

  const calcularPrecision = (
    usuario: { x: number; y: number }[],
    modelo: { x: number; y: number }[]
  ) => {
    if (usuario.length < 10 || modelo.length < 10) {
      setPuntuacion(0);
      return;
    }

    let sumaDistancias = 0;
    usuario.forEach(({ x: ux, y: uy }) => {
      let menorDistancia = Infinity;
      modelo.forEach(({ x: mx, y: my }) => {
        const dx = mx - ux;
        const dy = my - uy;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        if (distancia < menorDistancia) menorDistancia = distancia;
      });
      sumaDistancias += menorDistancia;
    });

    const promedio = sumaDistancias / usuario.length;
    const maxDistancia = 200;
    let baseScore = Math.max(0, 100 - (promedio / maxDistancia) * 100);

    let puntosCubiertos = 0;
    const umbral = 20;
    modelo.forEach(({ x: mx, y: my }) => {
      for (let i = 0; i < usuario.length; i++) {
        const { x: ux, y: uy } = usuario[i];
        const dx = mx - ux;
        const dy = my - uy;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        if (distancia <= umbral) {
          puntosCubiertos++;
          break;
        }
      }
    });

    const cobertura = puntosCubiertos / modelo.length;
    if (cobertura < 0.8) {
      baseScore = baseScore * cobertura;
    }

    setPuntuacion(Math.round(baseScore));
  };
const guardarCoordenadas = async (imagen: { x: number; y: number }[]) => {
  if (puntuacion === null) return alert("No hay puntuación aún.");

  const formateado = imagen.map(p => `[${Math.round(p.x)}, ${Math.round(p.y)}]`).join(',\n');
  const contenido = `[\n${formateado}\n]`;
  const jsonData = JSON.parse(contenido);

  const datos: EvaluacionEscala = {
    fecha: new Date().toISOString().split("T")[0],
    tipo_escala: "escala 2",
    resultado: jsonData,
    puntaje: puntuacion,
    id_paciente: 1,
    id_ejercicio: 2 // Usa un ID de ejercicio que EXISTE en la base
  };

  try {
    const resultado = await crearEvaluacionEscala(datos);
    alert(resultado ? "✅ Coordenadas guardadas" : "❌ Error al guardar");
  } catch (e) {
    console.error("❌ Error en POST:", e);
    alert("Error al enviar los datos");
  }
};



  const getColor = (puntaje: number | null) => {
    if (puntaje === null) return 'transparent';
    if (puntaje >= 85) return '#28a745';
    if (puntaje >= 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="copiafigura-wrapper">
      <Pizarra
        onFinishDraw={handleFinishDraw}
        coordsModelo={modeloCirculo}
        onModeloTransformado={setModeloTransformado}
        background="#fff"
        color="black"
        lineWidth={2}
      />

      {coords.length > 0 && (
        <button className="guardar-btn" onClick={() => guardarCoordenadas(coords)}>
          Guardar coordenadas
        </button>
      )}

      {puntuacion !== null && (
        <div className="resultado-box" style={{ background: getColor(puntuacion) }}>
          <Stars porcentaje={puntuacion} />
        </div>
      )}
    </div>
  );
};

export default CopiaFigura;

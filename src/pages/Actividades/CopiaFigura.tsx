import React, {useState, useEffect } from 'react';
import Pizarra from '../../components/Pizarra';
import { modeloCirculo } from '../../components/FiguraModelo';
import type { EvaluacionEscala} from '../../models/EvaluacionEscala';
import { crearEvaluacionEscala } from '../../services/evaluacionEscalaService';
import Stars from '../../components/Stars';

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

    // Distancia promedio desde puntos del trazo hacia el modelo
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

    // Cobertura del modelo: cuántos puntos del modelo están cerca del trazo
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

    // Penalización si cobertura es baja
    if (cobertura < 0.8) {
      baseScore = baseScore * cobertura; // reduce proporcionalmente
    }

    setPuntuacion(Math.round(baseScore));
  };

  /*
  const descargarCoordenadas = (datos: { x: number; y: number }[]) => {
  const formateado = datos
    .map(p => `[${Math.round(p.x)}, ${Math.round(p.y)}]`)
    .join(',\n');
  const contenido = `[\n${formateado}\n]`;
  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'coordenadas.txt';
  a.click();
  URL.revokeObjectURL(url);
  };*/

  const guardarCoordenadas = async (imagen: { x: number; y: number }[]) => {
    const formateado = imagen
      .map(p => `[${Math.round(p.x)}, ${Math.round(p.y)}]`)
      .join(',\n');
    const contenido = `[\n${formateado}\n]`;
    const jsonData = JSON.parse(contenido);
    
    const datos: EvaluacionEscala = {
      fecha: "2025-06-02",
      tipo_escala: "escala 2",
      resultado: jsonData,
      puntaje: puntuacion!,
      // Luego cambiar por el id del paciente realizando el ejercicio
      id_paciente: 1
    }

    const resultado = await crearEvaluacionEscala(datos);

    if (resultado) {
      alert("Coordenadas guardadas");
    } else {
      alert("Error al guardar las coordenadas")
    }

  };

  const getColor = (puntaje: number | null) => {
    if (puntaje === null) return 'transparent';
    if (puntaje >= 85) return '#28a745'; // verde
    if (puntaje >= 60) return '#ffc107'; // amarillo
    return '#dc3545'; // rojo
  };

  return (
    <div style={{ position: 'relative' }}>
      <Pizarra
        onFinishDraw={handleFinishDraw}
        coordsModelo={modeloCirculo}
        onModeloTransformado={setModeloTransformado}
        background="#fff"
        color="black"
        lineWidth={2}
      />

      {coords.length > 0 && (
        <button
          onClick={() => guardarCoordenadas(coords)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '8px 12px',
            fontWeight: 'bold',
            background: '#e60023',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            zIndex: 3
          }}
        >
          Guardar coordenadas
        </button>
      )}

      {puntuacion !== null && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: getColor(puntuacion),
            color: '#fff',
            padding: '12px 24px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '10px',
            zIndex: 4
          }}
        >
          <Stars porcentaje={puntuacion}></Stars>
        </div>
      )}
    </div>
  );
};

export default CopiaFigura;

import React, { useState } from 'react';
import Pizarra from '../components/Pizarra';
import './TrazadoGuiado.css';

const interpolarLinea = (puntos: [number, number][], paso = 0.02): [number, number][] => {
  const resultado: [number, number][] = [];
  for (let i = 0; i < puntos.length - 1; i++) {
    const [x1, y1] = puntos[i];
    const [x2, y2] = puntos[i + 1];
    for (let t = 0; t <= 1; t += paso) {
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      resultado.push([x, y]);
    }
  }
  return resultado;
};

const curva = (): [number, number][] => {
  const raw: [number, number][] = Array.from({ length: 50 }, (_, i) => {
    const x = 200 + i * 14;
    const y = 200 + Math.sin(i * 0.4) * 50;
    return [x, y];
  });
  return interpolarLinea(raw);
};

const zigzag = (): [number, number][] => {
  const raw: [number, number][] = [
    [200, 350], [280, 410], [360, 350],
    [440, 410], [520, 350], [600, 410], [680, 350],
  ];
  return interpolarLinea(raw);
};

const quebrada = (): [number, number][] => {
  const raw: [number, number][] = [
    [200, 500], [280, 540], [360, 510],
    [440, 560], [520, 530], [600, 570],
  ];
  return interpolarLinea(raw);
};

const figuras = [
  { nombre: 'Curva', coords: curva(), icono: '🌊' },
  { nombre: 'Zigzag', coords: zigzag(), icono: '📈' },
  { nombre: 'Línea Quebrada', coords: quebrada(), icono: '📉' },
];

const TrazadoGuiado: React.FC = () => {
  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);
  const [modeloT, setModeloT] = useState<{ x: number; y: number }[]>([]);
  const [canvasKey, setCanvasKey] = useState(0);
  const [etapa, setEtapa] = useState(0);
  const [resultados, setResultados] = useState<
    { figura: string; precision: number; duracion: number }[]
  >([]);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [habilitado, setHabilitado] = useState(true);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [tiempoInicio, setTiempoInicio] = useState<number>(Date.now());

  const modeloActual = figuras[etapa].coords;

  const handleFinishDraw = (p: { x: number; y: number }[]) => {
    if (habilitado) setCoords(p);
  };

  const calcularPrecision = (
    usuario: { x: number; y: number }[],
    modelo: { x: number; y: number }[]
  ): number => {
    if (usuario.length < 10 || modelo.length < 10) return 0;

    const umbral = 35;
    let puntosCubiertos = 0;

    modelo.forEach(puntoM => {
      const tocado = usuario.some(puntoU => {
        const dx = puntoU.x - puntoM.x;
        const dy = puntoU.y - puntoM.y;
        return Math.sqrt(dx * dx + dy * dy) <= umbral;
      });
      if (tocado) puntosCubiertos++;
    });

    const cobertura = puntosCubiertos / modelo.length;
    let score = cobertura * 100;

    const desviacion = usuario.reduce((acum, puntoU) => {
      const minDist = modelo.reduce((min, puntoM) => {
        const dx = puntoU.x - puntoM.x;
        const dy = puntoU.y - puntoM.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < min ? dist : min;
      }, Infinity);
      return acum + minDist;
    }, 0) / usuario.length;

    const factor = 1 - Math.min(desviacion / 60, 0.3);
    score *= factor;

    return Math.max(0, Math.round(score));
  };

  const finalizarEtapa = () => {
    setHabilitado(false);
    const tiempoFin = Date.now();
    const duracion = Math.round((tiempoFin - tiempoInicio) / 1000);

    if (coords.length && modeloT.length) {
      const puntaje = calcularPrecision(coords, modeloT);
      setPuntuacion(puntaje);
      setResultados(prev => [
        ...prev,
        {
          figura: figuras[etapa].nombre,
          precision: puntaje,
          duracion,
        },
      ]);
    } else {
      setPuntuacion(0);
      setResultados(prev => [
        ...prev,
        {
          figura: figuras[etapa].nombre,
          precision: 0,
          duracion,
        },
      ]);
    }
  };

  const continuar = () => {
    if (etapa < figuras.length - 1) {
      setEtapa(e => e + 1);
      setCanvasKey(k => k + 1);
      setCoords([]);
      setPuntuacion(null);
      setHabilitado(true);
      setTiempoInicio(Date.now());
    } else {
      setMostrarPopup(true);
    }
  };

  const colorClass =
    puntuacion === null
      ? ''
      : puntuacion > 80
      ? 'verde'
      : puntuacion >= 50
      ? 'amarillo'
      : 'rojo';

  return (
    <div className="trazado-fullscreen">
      <main className="trazado-contenido">
        <h2 className="titulo-ejercicio">
          {figuras[etapa].icono} {figuras[etapa].nombre}
        </h2>

        <div className={`canvas-container ${habilitado ? '' : 'disabled'}`}>
          <Pizarra
            key={canvasKey}
            color="#005EB8"
            colorModelo="#E30613"
            background="#fff"
            lineWidth={3}
            onFinishDraw={handleFinishDraw}
            onModeloTransformado={setModeloT}
            coordsModelo={modeloActual}
            cerrarTrazo={false}
          />
        </div>

        <div className="botones">
          {puntuacion === null ? (
            <button className="btn-rojo" onClick={finalizarEtapa}>
              Finalizar
            </button>
          ) : etapa < figuras.length - 1 ? (
            <>
              <div className={`resultado ${colorClass}`}>
                Precisión: {puntuacion}%
              </div>
              <button className="btn-rojo" onClick={continuar}>
                Continuar
              </button>
            </>
          ) : (
            <div className="resultado-final">
              <h3>Resultados Finales</h3>
              {resultados.map((r, i) => (
                <p key={i}>
                  {figuras[i].icono} {r.figura}: {r.precision}% – {r.duracion}s
                </p>
              ))}
              <p>
                <strong>
                  Promedio Total:{' '}
                  {Math.round(resultados.reduce((a, b) => a + b.precision, 0) / resultados.length)}%
                </strong>
              </p>
              <button className="btn-rojo" onClick={() => setMostrarPopup(true)}>
                Ver mensaje final
              </button>
            </div>
          )}
        </div>
      </main>

      {mostrarPopup && (
        <div className="popup-final">
          <div className="popup-contenido">
            <h2>🎉 ¡Bien hecho!</h2>
            <p>Completaste todos los ejercicios con éxito.</p>
            <button className="btn-rojo" onClick={() => setMostrarPopup(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrazadoGuiado;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pizarra from '../../components/Pizarra';
import { modelos } from '../../components/coordenadasModelos';
import type { EvaluacionEscala } from '../../models/EvaluacionEscala';
import { crearEvaluacionEscala } from '../../services/evaluacionEscalaService';
import Stars from '../../components/Stars';
import MenuEjercicio from '../../components/MenuEjercicio';
import './CopiaFigura.css';

// 🎯 Diccionario de IDs reales por figura
const idsEjercicios: Record<string, number> = {
  circulo: 1,
  cuadrado: 2,
  triangulo: 3,
  estrella: 4,
  flecha: 5,
  pacman: 6,
  infinito: 7,
  arbol: 8,
  nube: 9
};

const CopiaFigura: React.FC = () => {
  const { nivel, figura } = useParams();
  const navigate = useNavigate();
  const modelo = modelos[figura || ''];

  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);
  const [modeloTransformado, setModeloTransformado] = useState<{ x: number; y: number }[]>([]);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [grosorLinea, setGrosorLinea] = useState(4);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [precisiones, setPrecisiones] = useState<number[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const figurasSinSuavizado = ['cuadrado', 'triangulo', 'estrella', 'flecha'];
  const suavizar = !figurasSinSuavizado.includes(figura || '');

  const figurasNivel: Record<number, string[]> = {
    1: ['circulo', 'cuadrado', 'triangulo'],
    2: ['estrella', 'flecha', 'pacman'],
    3: ['infinito', 'arbol', 'nube']
  };
  const nivelNumero = Number((nivel || '').replace(/[^\d]/g, ''));
  const figs = figurasNivel[nivelNumero] || [];
  const actualIndex = figs.indexOf(figura || '');

  useEffect(() => {
    if (!modelo || modelo.length === 0) {
      alert('❌ Modelo no encontrado');
    }
  }, [modelo]);

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
      for (const { x: ux, y: uy } of usuario) {
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
    if (cobertura < 0.8) baseScore *= cobertura;

    const finalScore = Math.round(baseScore);
    setPuntuacion(finalScore);
    setPrecisiones(prev => [...prev, finalScore]);
  };

  const guardarCoordenadas = async (imagen: { x: number; y: number }[]) => {
    if (!figura || !nivel || puntuacion === null) return;

    try {
      const formateado = imagen.map(p => `[${Math.round(p.x)}, ${Math.round(p.y)}]`).join(',\n');
      const contenido = `[\n${formateado}\n]`;
      const jsonData = JSON.parse(contenido);

      const datos: EvaluacionEscala = {
        fecha: new Date().toISOString().split("T")[0],
        tipo_escala: "escala 2",
        resultado: jsonData,
        puntaje: puntuacion,
        id_paciente: 1,
        id_ejercicio: idsEjercicios[figura] || 0 
      };

      const resultado = await crearEvaluacionEscala(datos);
      console.log("✅ Evaluación creada:", datos);
      console.log(resultado ? "✅ Coordenadas guardadas" : "❌ Error al guardar");

      const siguiente = figs[actualIndex + 1];
      if (siguiente) {
        setCoords([]);
        setPuntuacion(null);
        navigate(`/copiar-figura/nivel${nivelNumero}/${siguiente}`);
      } else {
        setMostrarResumen(true);
      }
    } catch (e) {
      console.error("❌ Error en POST:", e);
    }
  };

  const getColor = (puntaje: number | null) => {
    if (puntaje === null) return 'transparent';
    if (puntaje >= 85) return '#28a745';
    if (puntaje >= 60) return '#ffc107';
    return '#dc3545';
  };

  const promedioPrecision = Math.round(
    precisiones.reduce((a, b) => a + b, 0) / (precisiones.length || 1)
  );

  const anterior = figs[actualIndex - 1];
  const siguiente = figs[actualIndex + 1];

  return (
    <div className="copiafigura-wrapper">
      <MenuEjercicio
        onReiniciar={() => {
          setCoords([]);
          setPuntuacion(null);
          setGrosorLinea(4); 
          setResetKey(prev => prev + 1);
        }}
        onVolverSeleccion={() => navigate('/figuras')}
        onCambiarAncho={setGrosorLinea}
      />

      <div className="selector-nivel">
        {anterior && (
          <button onClick={() => navigate(`/copiar-figura/nivel${nivelNumero}/${anterior}`)}>
            ← {anterior}
          </button>
        )}
        <span className="actual">{figura}</span>
        {siguiente && (
          <button onClick={() => navigate(`/copiar-figura/nivel${nivelNumero}/${siguiente}`)}>
            {siguiente} →
          </button>
        )}
      </div>

      <Pizarra
        key={resetKey}
        onFinishDraw={setCoords}
        coordsModelo={modelo}
        onModeloTransformado={setModeloTransformado}
        background="#fff"
        color="black"
        lineWidth={grosorLinea}
        colorModelo="#aaaaaa"
        grosorModelo={10}
        rellenarModelo={true}
        cerrarTrazo={true}
        suavizarModelo={suavizar}
      />

      {coords.length > 0 && (
        <button className="guardar-btn" onClick={() => guardarCoordenadas(coords)}>
          Siguiente
        </button>
      )}

      {puntuacion !== null && (
        <div className="resultado-box" style={{ background: getColor(puntuacion) }}>
          <Stars porcentaje={puntuacion} />
        </div>
      )}

      {mostrarResumen && (
        <div className="resumen-modal">
          <div className="resumen-contenido">
            <h2>🎉 Resumen de Nivel {nivelNumero}</h2>
            <p>Ejercicios realizados: {precisiones.length}</p>
            <p>Desempeño general:</p>
            <Stars porcentaje={promedioPrecision} />
            <button className="volver-btn" onClick={() => navigate('/figuras')}>
              Volver a la selección de niveles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopiaFigura;

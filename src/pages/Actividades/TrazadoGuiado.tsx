// Contenido de src/pages/Actividades/TrazadoGuiado.tsx
import { useGlobalPaciente } from '../../context/PacienteContext';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pizarra from '../../components/Pizarra';
import { modelosTrazado } from '../../components/coordenadasModelos';
import Stars from '../../components/Stars';
import MenuEjercicio from '../../components/MenuEjercicio';
import { crearEvaluacionEscala } from '../../services/evaluacionEscalaService'; // ✅ importa servicio
import type { EvaluacionEscala } from '../../models/EvaluacionEscala'; // ✅ importa tipo
import './CopiaFigura.css';

const nombresBonitos: Record<string, string> = {
  montaña: 'Montaña',
  ondas: 'Ondas Suaves',
  ola: 'Ola Marina',
  punteagudo: 'Picos Agudos',
  caminocurva: 'Camino Curvo',
  espiral: 'Espiral Creativa',
  curvasE: 'Curvas Enfrentadas',
  doble_espiral: 'Doble Espiral',
  zigzag_espiral: 'Zigzag en Espiral',
};

const TrazadoGuiado: React.FC = () => {
  const { id } = useGlobalPaciente();

  const { nivel, figura } = useParams();
  const navigate = useNavigate();
  const modelo = modelosTrazado[figura || ''];

  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);
  const [modeloTransformado, setModeloTransformado] = useState<{ x: number; y: number }[]>([]);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [grosorLinea, setGrosorLinea] = useState(4);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [precisiones, setPrecisiones] = useState<number[]>([]);
  const [keyPizarra, setKeyPizarra] = useState(Date.now());

  const trazadosNivel: Record<number, string[]> = {
    1: ['montaña', 'ondas', 'ola'],
    2: ['punteagudo', 'caminocurva', 'espiral'],
    3: ['curvasE', 'doble_espiral', 'zigzag_espiral'],
  };

  const nivelNumero = Number((nivel || '').replace(/[^\d]/g, ''));
  const figuras = trazadosNivel[nivelNumero] || [];
  const actualIndex = figuras.indexOf(figura || '');

  useEffect(() => {
    if (!modelo || modelo.length === 0) {
      alert('❌ Modelo no encontrado');
    }
  }, [modelo]);

  useEffect(() => {
    // 👇 **LÓGICA MEJORADA**
    // Solo calcular si el trazo tiene una longitud mínima
    if (coords.length > 20 && modeloTransformado.length > 0) {
      calcularPrecision(coords, modeloTransformado);
    } else {
      // Si no, no se muestra puntuación
      setPuntuacion(null);
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

    const estaCerca = usuario.some(puntoUsuario => 
      modelo.some(puntoModelo => {
        const distancia = Math.sqrt(
          Math.pow(puntoUsuario.x - puntoModelo.x, 2) +
          Math.pow(puntoUsuario.y - puntoModelo.y, 2)
        );
        return distancia < 150; // Umbral de 150px
      })
    );

    if (!estaCerca) {
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
      baseScore *= cobertura;
    }

    const finalScore = Math.round(baseScore);
    setPuntuacion(finalScore);
    setPrecisiones(prev => [...prev, finalScore]);
  };

const guardarCoordenadas = async () => {
  if (!figura || !nivel || puntuacion === null) return;

  try {
    // Igual que en CopiaFigura: construir string y parsear a JSON
    const formateado = coords.map(p => `[${Math.round(p.x)}, ${Math.round(p.y)}]`).join(',\n');
    const contenido = `[\n${formateado}\n]`;
    const jsonData = JSON.parse(contenido); // <- ahora sí encaja con tipo JSON

    const datos: EvaluacionEscala = {
      fecha: new Date().toISOString().split("T")[0],
      tipo_escala: "trazado guiado",
      resultado: jsonData, // <- se ajusta al tipo JSON
      puntaje: puntuacion,
      id_paciente: Number(id),
      id_ejercicio: actualIndex + 1 + (nivelNumero - 1) * 3
    };

   console.log('Enviando datos de TrazadoGuiado:', datos);

    const resultado = await crearEvaluacionEscala(datos);
    console.log("✅ Evaluación creada:", datos);
    console.log(resultado ? "✅ Coordenadas guardadas" : "❌ Error al guardar");
  } catch (e) {
    console.error("❌ Error en POST:", e);
  }
};


  const siguienteFigura = async () => {
    await guardarCoordenadas(); // ✅ guardar antes de continuar
    const siguiente = figuras[actualIndex + 1];
    if (siguiente) {
      setCoords([]);
      setPuntuacion(null);
      setKeyPizarra(Date.now());
      navigate(`/trazado-guiado/nivel${nivelNumero}/${siguiente}`);
    } else {
      setMostrarResumen(true);
    }
  };

  const promedioPrecision = Math.round(
    precisiones.reduce((a, b) => a + b, 0) / (precisiones.length || 1)
  );

  const anterior = figuras[actualIndex - 1];
  const siguiente = figuras[actualIndex + 1];
  
  // 👇 **NUEVAS FUNCIONES PARA ESTILOS DINÁMICOS**
  const getColorClass = (puntaje: number | null) => {
    if (puntaje === null) return '';
    if (puntaje >= 80) return 'verde';
    if (puntaje >= 40) return 'amarillo';
    return 'rojo';
  };

  const getMensaje = (puntaje: number | null) => {
    if (puntaje === null) return '';
    if (puntaje >= 80) return '¡Excelente!';
    if (puntaje >= 40) return '¡Muy bien!';
    return '¡Sigue intentando!';
  };

  return (
    <div className="copiafigura-wrapper">
      <MenuEjercicio
        onReiniciar={() => {
          setCoords([]);
          setPuntuacion(null);
          setGrosorLinea(4);
          setKeyPizarra(Date.now());
        }}
        onVolverSeleccion={() => navigate('/trazados')}
        onCambiarAncho={(valor) => setGrosorLinea(valor)}
      />

      <div className="selector-nivel">
        {anterior && (
          <button onClick={() => navigate(`/trazado-guiado/nivel${nivelNumero}/${anterior}`)}>
            ← {nombresBonitos[anterior] || anterior}
          </button>
        )}
        <span className="actual">{nombresBonitos[figura || ''] || figura}</span>
        {siguiente && (
          <button onClick={siguienteFigura}>
            {nombresBonitos[siguiente] || siguiente} →
          </button>
        )}
      </div>

      <Pizarra
        key={keyPizarra}
        onFinishDraw={setCoords}
        coordsModelo={modelo}
        onModeloTransformado={setModeloTransformado}
        background="#fff"
        color="black"
        lineWidth={grosorLinea}
        colorModelo="#aaaaaa"
        grosorModelo={10}
        rellenarModelo={false}
        cerrarTrazo={false}
      />

      {coords.length > 20 && ( // Solo mostrar el botón si el trazo es válido
        <button className="guardar-btn" onClick={siguienteFigura}>
          Siguiente
        </button>
      )}
      
      {/* 👇 JSX MODIFICADO PARA USAR LA CLASE Y MENSAJE DINÁMICOS */}
      {puntuacion !== null && (
        <div className={`resultado-box ${getColorClass(puntuacion)}`}>
          <Stars porcentaje={puntuacion} />
          <div className="resultado-mensaje">{getMensaje(puntuacion)}</div>
        </div>
      )}

      {mostrarResumen && (
        <div className="resumen-modal">
          <div className="resumen-contenido">
            <h2>🎉 Resumen de Nivel {nivelNumero}</h2>
            <p>Ejercicios realizados: {precisiones.length}</p>
            <p>Desempeño general:</p>
            <Stars porcentaje={promedioPrecision} />
            <button
              className="volver-btn"
              onClick={() => navigate('/trazados')}
            >
              Volver a la selección de niveles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrazadoGuiado;
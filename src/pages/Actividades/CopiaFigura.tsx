// Contenido de src/pages/Actividades/CopiaFigura.tsx
import { useGlobalPaciente } from '../../context/PacienteContext';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DoblePizarra from '../../components/DoblePizarra';
import { modelos } from '../../components/coordenadasModelos';
import type { EvaluacionEscala } from '../../models/EvaluacionEscala';
import { crearEvaluacionEscala } from '../../services/evaluacionEscalaService';
import Stars from '../../components/Stars';
import MenuEjercicio from '../../components/MenuEjercicio';
import EvaluacionIA from '../../components/EvaluacionIA';
import ResumenIA from '../../components/ResumenIA';
import IconoIA from '../../components/IconoIA';
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
  const { id } = useGlobalPaciente();

  const { nivel, figura } = useParams();
  const navigate = useNavigate();
  const modelo = modelos[figura || ''];

  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);
  const [modeloTransformado, setModeloTransformado] = useState<{ x: number; y: number }[]>([]);
  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [grosorLinea, setGrosorLinea] = useState(4);
  const [precisiones, setPrecisiones] = useState<number[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [posicionFigura, setPosicionFigura] = useState<'izquierda' | 'derecha'>('izquierda');
  const [mostrarEvaluacionIA, setMostrarEvaluacionIA] = useState(false);
  const [, setPuntuacionIA] = useState<number | null>(null);
  const [mostrarResumenIA, setMostrarResumenIA] = useState(false);
  const [puntuacionesUsuario, setPuntuacionesUsuario] = useState<number[]>([]); // Para el resumen IA

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
    if (coords.length > 20 && modeloTransformado.length > 0) {
      // Filtrar coordenadas del área de dibujo correcta
      const coordsFiltradas = filtrarCoordenadasAreaDibujo(coords, posicionFigura);
      
      // 👇 **ESCALAR COORDENADAS DEL USUARIO PARA QUE COINCIDAN CON EL MODELO**
      const coordsEscaladas = escalarCoordenadasUsuario(coordsFiltradas, posicionFigura);
      
      console.log('🔍 Debug evaluación CopiaFigura:', {
        coordsOriginales: coords.length,
        coordsFiltradas: coordsFiltradas.length,
        coordsEscaladas: coordsEscaladas.length,
        posicionFigura,
        modeloTransformado: modeloTransformado.length
      });
      
      if (coordsEscaladas.length > 10) {
        calcularPrecision(coordsEscaladas, modeloTransformado);
      } else {
        console.log('⚠️ No hay suficientes coordenadas escaladas para evaluar');
        setPuntuacion(null);
      }
    } else {
      setPuntuacion(null);
    }
  }, [coords, modeloTransformado, posicionFigura]);

  // Función para filtrar coordenadas del área de dibujo correcta
  const filtrarCoordenadasAreaDibujo = (coords: { x: number; y: number }[], posicion: 'izquierda' | 'derecha') => {
    const pizarraWidth = window.innerWidth / 2;
    
    return coords.filter(coord => {
      if (posicion === 'izquierda') {
        // Si la figura está a la izquierda, solo tomar coordenadas de la derecha
        return coord.x > pizarraWidth;
      } else {
        // Si la figura está a la derecha, solo tomar coordenadas de la izquierda
        return coord.x < pizarraWidth;
      }
    });
  };

  // 👇 **NUEVA FUNCIÓN PARA ESCALAR COORDENADAS DEL USUARIO**
  const escalarCoordenadasUsuario = (coords: { x: number; y: number }[], posicion: 'izquierda' | 'derecha') => {
    const pizarraWidth = window.innerWidth / 2;
    const pizarraHeight = window.innerHeight;
    
    return coords.map(coord => {
      // Convertir coordenadas del área de dibujo a coordenadas relativas (0-1)
      let xRelativo, yRelativo;
      
      if (posicion === 'izquierda') {
        // Usuario dibuja en la derecha, convertir a coordenadas relativas de la derecha
        xRelativo = (coord.x - pizarraWidth) / pizarraWidth;
        yRelativo = coord.y / pizarraHeight;
      } else {
        // Usuario dibuja en la izquierda, convertir a coordenadas relativas de la izquierda
        xRelativo = coord.x / pizarraWidth;
        yRelativo = coord.y / pizarraHeight;
      }
      
      // Convertir a coordenadas del modelo (como si estuviera en la pizarra izquierda)
      return {
        x: xRelativo * pizarraWidth,
        y: yRelativo * pizarraHeight
      };
    });
  };

  // 👇 **FUNCIONES AUXILIARES PARA VALIDACIÓN DE FORMA**
  const calcularArea = (coords: { x: number; y: number }[]) => {
    if (coords.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i].x * coords[j].y;
      area -= coords[j].x * coords[i].y;
    }
    return Math.abs(area) / 2;
  };

  const calcularLongitud = (coords: { x: number; y: number }[]) => {
    let longitud = 0;
    for (let i = 1; i < coords.length; i++) {
      const dx = coords[i].x - coords[i - 1].x;
      const dy = coords[i].y - coords[i - 1].y;
      longitud += Math.sqrt(dx * dx + dy * dy);
    }
    return longitud;
  };

  // 👇 **EVALUACIÓN PARA EL NIÑO (MÁS FLEXIBLE)**
  const calcularPrecisionAmigable = (
    usuario: { x: number; y: number }[],
    modelo: { x: number; y: number }[]
  ) => {
    console.log('🎯 Calculando precisión AMIGABLE CopiaFigura:', {
      usuarioLength: usuario.length,
      modeloLength: modelo.length
    });

    if (usuario.length < 10 || modelo.length < 10) {
      console.log('❌ No hay suficientes puntos para evaluar');
      return 0;
    }

    const estaCerca = usuario.some(puntoUsuario => 
      modelo.some(puntoModelo => {
        const distancia = Math.sqrt(
          Math.pow(puntoUsuario.x - puntoModelo.x, 2) +
          Math.pow(puntoUsuario.y - puntoModelo.y, 2)
        );
        return distancia < 200; // 👈 **MÁS FLEXIBLE: 200px**
      })
    );

    console.log('📍 ¿Está cerca del modelo? (amigable)', estaCerca);

    if (!estaCerca) {
      console.log('❌ El trazo no está cerca del modelo');
      return 0;
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
    const maxDistancia = 250; // 👈 **MÁS FLEXIBLE: 250px**
    let baseScore = Math.max(0, 100 - (promedio / maxDistancia) * 100);
    
    // 👇 **BONUS MÁS CONSERVADOR PARA NIÑOS**
    if (usuario.length > 100) baseScore += 5; // Bonus menor por trazo detallado
    if (baseScore > 0 && baseScore < 20) baseScore += 5; // Bonus mínimo por intentar
    
    let puntosCubiertos = 0;
    const umbral = 30; // 👈 **MÁS FLEXIBLE: 30px**
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
    if (cobertura < 0.6) { // 👈 **MÁS ESTRICTO: 60%**
      baseScore *= cobertura;
    }

    // 👇 **VALIDACIÓN MÁS FLEXIBLE PARA NIÑOS**
    const validarFormaAmigable = () => {
      const areaModelo = calcularArea(modelo);
      const areaUsuario = calcularArea(usuario);
      
      const ratioArea = Math.min(areaModelo, areaUsuario) / Math.max(areaModelo, areaUsuario);
      if (ratioArea < 0.2) { // 👈 **MÁS ESTRICTO: 20%**
        console.log('⚠️ Áreas muy diferentes (amigable):', { areaModelo, areaUsuario, ratioArea });
        return 0.3; // Penalización más fuerte
      }
      
      return 1; // Sin penalización
    };

    const factorForma = validarFormaAmigable();
    baseScore *= factorForma;

    // 👇 **VALIDACIÓN ADICIONAL: PENALIZAR TRAZOS MUY SIMPLES**
    const validarComplejidad = () => {
      // Si el trazo es muy corto comparado con el modelo
      const ratioLongitud = usuario.length / modelo.length;
      if (ratioLongitud < 0.3) { // Menos del 30% de puntos
        console.log('⚠️ Trazo muy simple (amigable):', { 
          usuarioLength: usuario.length, 
          modeloLength: modelo.length, 
          ratioLongitud 
        });
        return 0.4; // Penalización por trazo muy simple
      }
      
      // Si el trazo tiene muy pocos puntos
      if (usuario.length < 20) {
        console.log('⚠️ Trazo muy corto (amigable):', { usuarioLength: usuario.length });
        return 0.3; // Penalización severa por trazo muy corto
      }
      
      return 1; // Sin penalización
    };

    const factorComplejidad = validarComplejidad();
    baseScore *= factorComplejidad;

    const finalScore = Math.min(100, Math.round(baseScore)); // Cap a 100
    console.log('🌟 Resultado evaluación AMIGABLE CopiaFigura:', {
      promedio,
      baseScore,
      cobertura,
      factorForma,
      factorComplejidad,
      finalScore,
      'bonus aplicado': baseScore > 0 ? 'Sí' : 'No'
    });
    
    return finalScore;
  };

  // 👇 **EVALUACIÓN PARA EL TERAPEUTA (PRECISA)**
  const calcularPrecisionMedica = (
    usuario: { x: number; y: number }[],
    modelo: { x: number; y: number }[]
  ) => {
    console.log('🎯 Calculando precisión MÉDICA CopiaFigura:', {
      usuarioLength: usuario.length,
      modeloLength: modelo.length
    });

    if (usuario.length < 10 || modelo.length < 10) {
      console.log('❌ No hay suficientes puntos para evaluar');
      return 0;
    }

    const estaCerca = usuario.some(puntoUsuario => 
      modelo.some(puntoModelo => {
        const distancia = Math.sqrt(
          Math.pow(puntoUsuario.x - puntoModelo.x, 2) +
          Math.pow(puntoUsuario.y - puntoModelo.y, 2)
        );
        return distancia < 150; // 👈 **PRECISO: 150px**
      })
    );

    console.log('📍 ¿Está cerca del modelo? (médico)', estaCerca);

    if (!estaCerca) {
      console.log('❌ El trazo no está cerca del modelo');
      return 0;
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
    const maxDistancia = 100; // 👈 **PRECISO: 100px**
    let baseScore = Math.max(0, 100 - (promedio / maxDistancia) * 100);
    
    let puntosCubiertos = 0;
    const umbral = 15; // 👈 **PRECISO: 15px**
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
    if (cobertura < 0.7) { // 👈 **PRECISO: 70%**
      baseScore *= cobertura;
    }

    // 👇 **VALIDACIÓN PRECISA PARA TERAPEUTAS**
    const validarFormaMedica = () => {
      const areaModelo = calcularArea(modelo);
      const areaUsuario = calcularArea(usuario);
      
      const ratioArea = Math.min(areaModelo, areaUsuario) / Math.max(areaModelo, areaUsuario);
      if (ratioArea < 0.3) { // 👈 **PRECISO: 30%**
        console.log('⚠️ Áreas muy diferentes (médico):', { areaModelo, areaUsuario, ratioArea });
        return 0.3; // Penalización severa
      }
      
      const longitudModelo = calcularLongitud(modelo);
      const longitudUsuario = calcularLongitud(usuario);
      const ratioLongitud = Math.min(longitudModelo, longitudUsuario) / Math.max(longitudModelo, longitudUsuario);
      if (ratioLongitud < 0.4) { // 👈 **PRECISO: 40%**
        console.log('⚠️ Longitudes muy diferentes (médico):', { longitudModelo, longitudUsuario, ratioLongitud });
        return 0.4; // Penalización moderada
      }
      
      return 1; // Sin penalización
    };

    const factorForma = validarFormaMedica();
    baseScore *= factorForma;

    const finalScore = Math.round(baseScore);
    console.log('🏥 Resultado evaluación MÉDICA CopiaFigura:', {
      promedio,
      baseScore,
      cobertura,
      factorForma,
      finalScore,
      sumaDistancias,
      usuarioLength: usuario.length,
      modeloLength: modelo.length,
      puntosCubiertos
    });
    
    return finalScore;
  };

  const calcularPrecision = (
    usuario: { x: number; y: number }[],
    modelo: { x: number; y: number }[]
  ) => {
    // 👇 **CALCULAR AMBAS EVALUACIONES**
    const puntuacionAmigable = calcularPrecisionAmigable(usuario, modelo);
    const puntuacionMedica = calcularPrecisionMedica(usuario, modelo);
    
    // 👇 **MOSTRAR AL NIÑO LA EVALUACIÓN AMIGABLE**
    setPuntuacion(puntuacionAmigable);
    setPrecisiones(prev => [...prev, puntuacionMedica]); // Guardar la médica para BD
    setPuntuacionesUsuario(prev => [...prev, puntuacionAmigable]); // Guardar la amigable para resumen IA
    
    console.log('🎯 EVALUACIÓN DUAL CopiaFigura:', {
      'Para el niño (estrellas)': puntuacionAmigable,
      'Para el terapeuta (datos)': puntuacionMedica,
      'Diferencia': puntuacionAmigable - puntuacionMedica
    });
  };

  const guardarCoordenadas = async (imagen: { x: number; y: number }[]) => {
    if (!figura || !nivel || puntuacion === null) return;

    try {
      const formateado = imagen.map(p => `[${Math.round(p.x)}, ${Math.round(p.y)}]`).join(',\n');
      const contenido = `[\n${formateado}\n]`;
      const jsonData = JSON.parse(contenido);

      // 👇 **USAR LA PUNTUACIÓN MÉDICA PARA GUARDAR (NO LA AMIGABLE)**
      const puntuacionMedica = precisiones[precisiones.length - 1] || 0;

      // Recibir id del paciente seleccionado
      const datos: EvaluacionEscala = {
        fecha: new Date().toISOString().split("T")[0],
        tipo_escala: "escala 2",
        resultado: jsonData,
        puntaje: puntuacionMedica, // 👈 **PUNTUACIÓN MÉDICA PRECISA**
        id_paciente: Number(id),
        id_ejercicio: idsEjercicios[figura] || 0
      };

      console.log('Enviando datos de CopiaFigura (MÉDICOS):', datos);
      console.log('📊 Comparación CopiaFigura:', {
        'Puntuación mostrada al niño': puntuacion,
        'Puntuación guardada para terapeuta': puntuacionMedica
      });

      const resultado = await crearEvaluacionEscala(datos);
      console.log("✅ Evaluación MÉDICA creada:", datos);
      console.log(resultado ? "✅ Coordenadas guardadas" : "❌ Error al guardar");

      const siguiente = figs[actualIndex + 1];
      if (siguiente) {
        setCoords([]);
        setPuntuacion(null);
        navigate(`/copiar-figura/nivel${nivelNumero}/${siguiente}`);
      } else {
        // Mostrar resumen IA para todos los niveles
        setMostrarResumenIA(true);
      }
    } catch (e) {
      console.error("❌ Error en POST:", e);
    }
  };

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


  // Promedio para el resumen IA (usando las puntuaciones que vio el usuario)
  const promedioUsuario = Math.round(
    puntuacionesUsuario.reduce((a, b) => a + b, 0) / (puntuacionesUsuario.length || 1)
  );

  const anterior = figs[actualIndex - 1];
  const siguiente = figs[actualIndex + 1];

  // Función para mostrar evaluación IA manualmente
  const manejarEvaluarConIA = () => {
    if (coords.length > 20 && modeloTransformado.length > 0) {
      setMostrarEvaluacionIA(true);
    }
  };

  // Función para aceptar la evaluación de IA
  const manejarAceptarEvaluacionIA = (estrellasIA: number) => {
    setPuntuacionIA(estrellasIA);
    // Convertir estrellas a porcentaje (1 estrella = 20%, 5 estrellas = 100%)
    const nuevaPuntuacion = Math.round((estrellasIA / 5) * 100);
    setPuntuacion(nuevaPuntuacion);
  };


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
        onCambiarPosicionFigura={setPosicionFigura}
        posicionFigura={posicionFigura}
        mostrarOpcionPosicion={true}
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

      <DoblePizarra
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
        posicionFigura={posicionFigura}
      />

      {/* Botón Siguiente arriba a la derecha */}
      {coords.length > 0 && (
        <button 
          className="guardar-btn" 
          onClick={() => guardarCoordenadas(coords)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          Siguiente
        </button>
      )}
      
      {/* Botón de evaluación IA abajo a la derecha */}
      {coords.length > 0 && (
        <button 
          onClick={manejarEvaluarConIA}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            width: 'auto',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#b91c1c';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <IconoIA size={24} className="compacto" />
          IA
        </button>
      )}

      {/* 👇 JSX MODIFICADO PARA USAR LA CLASE Y MENSAJE DINÁMICOS */}
      {puntuacion !== null && (
        <div className={`resultado-box ${getColorClass(puntuacion)}`}>
          <Stars porcentaje={puntuacion} />
          <div className="resultado-mensaje">{getMensaje(puntuacion)}</div>
        </div>
      )}


      {/* Evaluación IA */}
      {mostrarEvaluacionIA && modeloTransformado.length > 0 && (
        <EvaluacionIA
          coordenadasModelo={modeloTransformado}
          coordenadasPaciente={escalarCoordenadasUsuario(filtrarCoordenadasAreaDibujo(coords, posicionFigura), posicionFigura)}
          figuraObjetivo={figura || 'Figura'}
          puntuacionOriginal={puntuacion ? Math.round((puntuacion / 100) * 5) : 1}
          onClose={() => setMostrarEvaluacionIA(false)}
          onAceptarEvaluacion={manejarAceptarEvaluacionIA}
        />
      )}

      {/* Resumen IA para todos los niveles */}
      {mostrarResumenIA && (
        <ResumenIA
          tipoEjercicio="Copia de Figuras"
          nivel={nivelNumero}
          precisiones={puntuacionesUsuario}
          promedioPrecision={promedioUsuario}
          ejerciciosCompletados={puntuacionesUsuario.length}
          onClose={() => {
            setMostrarResumenIA(false);
            navigate('/figuras');
          }}
        />
      )}

    </div>
  );
};

export default CopiaFigura;
import React, { useState, useEffect } from 'react';
import { iaService } from '../services/iaService';
import { useGlobalPaciente } from '../context/PacienteContext';
import IconoIA from './IconoIA';
import './ResumenNivel1IA.css';

interface ResumenIAProps {
  tipoEjercicio: string;
  nivel: number;
  precisiones: number[];
  promedioPrecision: number;
  ejerciciosCompletados: number;
  onClose: () => void;
}

interface ResumenIA {
  resumen: string;
  fortalezas: string[];
  areasMejora: string[];
  recomendaciones: string[];
}

const ResumenIA: React.FC<ResumenIAProps> = ({
  tipoEjercicio,
  nivel,
  precisiones,
  promedioPrecision,
  ejerciciosCompletados,
  onClose
}) => {
  const { pacienteSeleccionado, nombrePaciente } = useGlobalPaciente();
  const [resumenIA, setResumenIA] = useState<ResumenIA | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generarResumen = async () => {
      try {
        setCargando(true);
        setError(null);

        const perfilPaciente = {
          nombre: nombrePaciente || 'Paciente',
          id: pacienteSeleccionado?.id?.toString() || '0',
          edad: pacienteSeleccionado?.edad?.toString(),
          diagnostico: pacienteSeleccionado?.diagnostico
        };

        console.log('🔍 ResumenIA - Datos enviados:', {
          perfilPaciente,
          tipoEjercicio,
          precisiones,
          promedioPrecision,
          ejerciciosCompletados,
          nivel
        });

        const resumen = await iaService.generarResumenNivel(
          perfilPaciente,
          tipoEjercicio,
          precisiones,
          promedioPrecision,
          ejerciciosCompletados,
          nivel
        );

        console.log('🔍 ResumenIA - Resultado recibido:', resumen);
        
        // Mapear las propiedades del backend al formato esperado por el frontend
        const resumenMapeado = {
          resumen: resumen.resumen,
          fortalezas: resumen.fortalezas || [],
          areasMejora: resumen.areas_mejora || resumen.areasMejora || [],
          recomendaciones: resumen.recomendaciones || []
        };
        
        console.log('🔍 ResumenIA - Resumen mapeado:', resumenMapeado);
        setResumenIA(resumenMapeado);
      } catch (err) {
        console.error('Error generando resumen IA:', err);
        setError('Error al generar resumen con IA');
      } finally {
        setCargando(false);
      }
    };

    generarResumen();
  }, [tipoEjercicio, nivel, precisiones, promedioPrecision, ejerciciosCompletados, pacienteSeleccionado, nombrePaciente]);

  if (cargando) {
    return (
      <div className="resumen-nivel1-overlay">
        <div className="resumen-nivel1-container">
          <div className="resumen-nivel1-loading">
            <div className="resumen-nivel1-loading-dots">
              <div className="resumen-nivel1-loading-dot"></div>
              <div className="resumen-nivel1-loading-dot"></div>
              <div className="resumen-nivel1-loading-dot"></div>
            </div>
            <p className="resumen-nivel1-loading-text">
              <IconoIA size={28} className="loading" />
              IA analizando tu desempeño...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resumenIA) {
    return (
      <div className="resumen-nivel1-overlay">
        <div className="resumen-nivel1-container">
          <div className="resumen-nivel1-error">
            <h2>⚠️ Error</h2>
            <p>{error || 'No se pudo generar el resumen'}</p>
            <button className="resumen-nivel1-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resumen-nivel1-overlay">
      <div className="resumen-nivel1-container">
        <div className="resumen-nivel1-header">
          <h2>🎉 Resumen IA - Nivel {nivel}</h2>
          <p className="resumen-nivel1-subtitulo">
            Análisis personalizado de tu desempeño
          </p>
        </div>

        <div className="resumen-nivel1-body">
          {/* Estadísticas Básicas */}
          <div className="resumen-nivel1-stats">
            <div className="resumen-nivel1-stat">
              <span className="resumen-nivel1-stat-number">{ejerciciosCompletados}</span>
              <span className="resumen-nivel1-stat-label">Ejercicios Completados</span>
            </div>
            <div className="resumen-nivel1-stat">
              <span className="resumen-nivel1-stat-number">{promedioPrecision}%</span>
              <span className="resumen-nivel1-stat-label">Promedio General</span>
            </div>
          </div>

          {/* Resumen Principal */}
          <div className="resumen-nivel1-resumen">
            <h3>📝 Resumen General</h3>
            <p>{resumenIA.resumen}</p>
          </div>

          {/* Fortalezas */}
          <div className="resumen-nivel1-fortalezas">
            <h3>💪 Fortalezas Identificadas</h3>
            <ul>
              {(resumenIA.fortalezas || []).map((fortaleza, index) => (
                <li key={index}>✅ {fortaleza}</li>
              ))}
            </ul>
          </div>

          {/* Áreas de Mejora */}
          <div className="resumen-nivel1-mejoras">
            <h3>🎯 Áreas de Mejora</h3>
            <ul>
              {(resumenIA.areasMejora || []).map((area, index) => (
                <li key={index}>📈 {area}</li>
              ))}
            </ul>
          </div>

          {/* Recomendaciones */}
          <div className="resumen-nivel1-recomendaciones">
            <h3>💡 Recomendaciones</h3>
            <ul>
              {(resumenIA.recomendaciones || []).map((recomendacion, index) => (
                <li key={index}>⭐ {recomendacion}</li>
              ))}
            </ul>
          </div>

          {/* Botón de Cerrar */}
          <div className="resumen-nivel1-actions">
            <button className="resumen-nivel1-btn primario" onClick={onClose}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenIA;

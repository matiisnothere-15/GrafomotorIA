import React, { useState, useEffect } from 'react';
import { iaService } from '../services/iaService';
import './EvaluacionIA.css';

interface EvaluacionIAProps {
  coordenadasModelo: Array<{ x: number; y: number }>;
  coordenadasPaciente: Array<{ x: number; y: number }>;
  figuraObjetivo: string;
  puntuacionOriginal: number; // Puntuación del sistema actual (1-5)
  onClose: () => void;
  onAceptarEvaluacion: (estrellasIA: number) => void; // Ahora es obligatorio
}

const EvaluacionIA: React.FC<EvaluacionIAProps> = ({
  coordenadasModelo,
  coordenadasPaciente,
  figuraObjetivo,
  puntuacionOriginal,
  onClose,
  onAceptarEvaluacion
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [evaluacion, setEvaluacion] = useState<{
    estrellasIA: number;
    analisis: string;
    sugerencias: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    evaluarConIA();
  }, []);

  const evaluarConIA = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 EvaluacionIA - Datos enviados:', {
        coordenadasModelo: coordenadasModelo.length,
        coordenadasPaciente: coordenadasPaciente.length,
        figuraObjetivo,
        puntuacionOriginal,
        muestraModelo: coordenadasModelo.slice(0, 3),
        muestraPaciente: coordenadasPaciente.slice(0, 3)
      });

      const resultado = await iaService.evaluarCoordenadas(
        coordenadasModelo,
        coordenadasPaciente,
        figuraObjetivo,
        puntuacionOriginal
      );

      console.log('🔍 EvaluacionIA - Resultado recibido:', resultado);
      
      // Corregir el mapeo de propiedades
      const evaluacionMapeada = {
        estrellasIA: resultado.estrellas_ia,
        analisis: resultado.analisis,
        sugerencias: resultado.sugerencias
      };
      
      console.log('🔍 EvaluacionIA - Evaluación mapeada:', evaluacionMapeada);
      setEvaluacion(evaluacionMapeada);
    } catch (err) {
      setError('Error al evaluar con IA');
      console.error('Error en evaluación IA:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderizarEstrellas = (numero: number) => {
    console.log('🔍 EvaluacionIA - Renderizando estrellas:', numero);
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={`evaluacion-ia-estrella ${i <= numero ? '' : 'vacia'}`}
        >
          ★
        </span>
      );
    }
    return estrellas;
  };

  const manejarAceptar = () => {
    if (evaluacion) {
      onAceptarEvaluacion(evaluacion.estrellasIA);
    }
    onClose();
  };

  const manejarReintentar = () => {
    evaluarConIA();
  };

  if (isLoading) {
    return (
      <>
        <div className="evaluacion-ia-overlay" onClick={onClose} />
        <div className="evaluacion-ia-container">
          <div className="evaluacion-ia-header">
            <h3 className="evaluacion-ia-titulo">Análisis Especializado</h3>
            <p className="evaluacion-ia-subtitulo">Evaluando tu dibujo...</p>
          </div>
          
          <div className="evaluacion-ia-loading">
            <div className="evaluacion-ia-loading-text">Comparando coordenadas</div>
            <div className="evaluacion-ia-loading-dots">
              <div className="evaluacion-ia-loading-dot"></div>
              <div className="evaluacion-ia-loading-dot"></div>
              <div className="evaluacion-ia-loading-dot"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="evaluacion-ia-overlay" onClick={onClose} />
        <div className="evaluacion-ia-container">
          <div className="evaluacion-ia-header">
            <h3 className="evaluacion-ia-titulo">Error en Evaluación</h3>
          </div>
          
          <div className="evaluacion-ia-body">
            <p style={{ color: '#dc2626', marginBottom: '20px' }}>{error}</p>
            <div className="evaluacion-ia-actions">
              <button className="evaluacion-ia-btn secundario" onClick={onClose}>
                Cerrar
              </button>
              <button className="evaluacion-ia-btn primario" onClick={manejarReintentar}>
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!evaluacion) {
    return null;
  }

  return (
    <>
      <div className="evaluacion-ia-overlay" onClick={onClose} />
      <div className="evaluacion-ia-container">
        <div className="evaluacion-ia-header">
          <h3 className="evaluacion-ia-titulo">Análisis Especializado</h3>
          <p className="evaluacion-ia-subtitulo">Evaluación de: {figuraObjetivo}</p>
        </div>
        
        <div className="evaluacion-ia-body">
          {/* Estrellas de la IA */}
          <div className="evaluacion-ia-estrellas">
            {renderizarEstrellas(evaluacion.estrellasIA)}
          </div>
          
          <div className="evaluacion-ia-puntuacion">
            {evaluacion.estrellasIA}/5 Estrellas
          </div>

          {/* Información de la evaluación IA */}
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginBottom: '15px',
            padding: '8px',
            background: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #0ea5e9'
          }}>
            Análisis especializado en grafomotricidad pediátrica
          </div>

          {/* Análisis detallado */}
          <div className="evaluacion-ia-analisis">
            <strong>Análisis Especializado:</strong><br />
            {evaluacion.analisis}
          </div>

          {/* Sugerencias */}
          {evaluacion.sugerencias.length > 0 && (
            <div className="evaluacion-ia-sugerencias">
              <h4>Sugerencias para mejorar:</h4>
              {evaluacion.sugerencias.map((sugerencia, index) => (
                <div key={index} className="evaluacion-ia-sugerencia">
                  • {sugerencia}
                </div>
              ))}
            </div>
          )}

          {/* Botón de acción */}
          <div className="evaluacion-ia-actions">
            <button className="evaluacion-ia-btn primario" onClick={manejarAceptar}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluacionIA;

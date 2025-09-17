import React, { useState, useEffect } from 'react';
import { iaService } from '../services/iaService';
import './IAFeedback.css';

interface IAFeedbackProps {
  tipoEjercicio: string;
  figuraObjetivo: string;
  coordenadasTrazado: Array<{ x: number; y: number }>;
  tiempoEjercicio: number;
  puntuacion: number;
  onClose: () => void;
}

const IAFeedback: React.FC<IAFeedbackProps> = ({
  tipoEjercicio,
  figuraObjetivo,
  coordenadasTrazado,
  tiempoEjercicio,
  puntuacion,
  onClose
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generarFeedback();
  }, []);

  const generarFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generar descripción del trazado
      const descripcionTrazado = `
        Ejercicio: ${tipoEjercicio}
        Figura objetivo: ${figuraObjetivo}
        Tiempo de ejecución: ${tiempoEjercicio} segundos
        Puntuación: ${puntuacion}%
        Número de puntos: ${coordenadasTrazado.length}
        ${coordenadasTrazado.length > 0 ? 'Trazado completado exitosamente' : 'Trazado no completado'}
      `;

      const analisis = await iaService.analizarTrazado(descripcionTrazado, figuraObjetivo);
      setFeedback(analisis);
    } catch (err) {
      setError('Error al generar feedback de IA');
      console.error('Error generando feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generarMotivacion = async () => {
    try {
      setIsLoading(true);
      const progreso = `Puntuación de ${puntuacion}% en ejercicio de ${figuraObjetivo}`;
      const motivacion = await iaService.generarMotivacion(progreso);
      setFeedback(motivacion);
    } catch (err) {
      setError('Error al generar motivación');
    } finally {
      setIsLoading(false);
    }
  };

  const sugerirEjercicios = async () => {
    try {
      setIsLoading(true);
      const dificultades = puntuacion < 40 ? ['precisión', 'control motor'] : [];
      const sugerencias = await iaService.sugerirEjercicios('Intermedio', dificultades);
      setFeedback(sugerencias);
    } catch (err) {
      setError('Error al generar sugerencias');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ia-feedback-container">
      <div className="ia-feedback-header">
        <div className="ia-feedback-title">Análisis IA</div>
        <button className="ia-feedback-close" onClick={onClose}>
          ×
        </button>
      </div>
      
      <div className="ia-feedback-body">
        {isLoading && (
          <div className="ia-feedback-loading">
            <span>Analizando</span>
            <div className="ia-feedback-loading-dot"></div>
            <div className="ia-feedback-loading-dot"></div>
            <div className="ia-feedback-loading-dot"></div>
          </div>
        )}
        
        {error && (
          <div className="ia-feedback-error">
            {error}
          </div>
        )}
        
        {!isLoading && !error && feedback && (
          <div className="ia-feedback-content">
            {feedback}
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="ia-feedback-actions">
            <button className="ia-feedback-action" onClick={generarFeedback}>
              Análisis completo
            </button>
            <button className="ia-feedback-action" onClick={generarMotivacion}>
              Motivación
            </button>
            <button className="ia-feedback-action" onClick={sugerirEjercicios}>
              Sugerencias
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IAFeedback;

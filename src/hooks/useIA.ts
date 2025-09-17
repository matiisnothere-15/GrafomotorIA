import { useState, useCallback } from 'react';
import { iaService } from '../services/iaService';

interface UsoIAParams {
  tipoEjercicio?: string;
  figuraObjetivo?: string;
  coordenadasTrazado?: Array<{ x: number; y: number }>;
  tiempoEjercicio?: number;
  errores?: number;
  nivelActual?: string;
}

interface PerfilPaciente {
  nombre: string;
  id: string;
  edad?: string;
  diagnostico?: string;
}

export const useIA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analizarEjercicio = useCallback(async (params: UsoIAParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const { coordenadasTrazado, figuraObjetivo, tiempoEjercicio, errores } = params;
      
      // Generar descripción del trazado basada en las coordenadas
      let descripcionTrazado = '';
      
      if (coordenadasTrazado && coordenadasTrazado.length > 0) {
        descripcionTrazado = `El paciente trazó ${coordenadasTrazado.length} puntos. `;
        
        if (tiempoEjercicio) {
          descripcionTrazado += `Tiempo de ejecución: ${tiempoEjercicio} segundos. `;
        }
        
        if (errores !== undefined) {
          descripcionTrazado += `Errores cometidos: ${errores}. `;
        }

        // Analizar suavidad del trazado
        if (coordenadasTrazado.length > 2) {
          const distancias = [];
          for (let i = 1; i < coordenadasTrazado.length; i++) {
            const dist = Math.sqrt(
              Math.pow(coordenadasTrazado[i].x - coordenadasTrazado[i-1].x, 2) +
              Math.pow(coordenadasTrazado[i].y - coordenadasTrazado[i-1].y, 2)
            );
            distancias.push(dist);
          }
          
          const promedioDistancia = distancias.reduce((a, b) => a + b, 0) / distancias.length;
          const variacionDistancia = Math.sqrt(
            distancias.reduce((sum, dist) => sum + Math.pow(dist - promedioDistancia, 2), 0) / distancias.length
          );

          if (variacionDistancia < promedioDistancia * 0.3) {
            descripcionTrazado += 'El trazado muestra buena consistencia en la velocidad. ';
          } else {
            descripcionTrazado += 'El trazado muestra variaciones en la velocidad que podrían indicar dificultades de control motor. ';
          }
        }
      }

      if (!figuraObjetivo) {
        throw new Error('No se especificó la figura objetivo para analizar');
      }

      const analisis = await iaService.analizarTrazado(descripcionTrazado, figuraObjetivo);
      return analisis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generarFeedback = useCallback(async (progreso: {
    ejerciciosCompletados: number;
    tiempoTotal: number;
    mejoraPrecision: number;
    ultimoEjercicio: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const mensajeProgreso = `
        Ejercicios completados: ${progreso.ejerciciosCompletados}
        Tiempo total de práctica: ${progreso.tiempoTotal} minutos
        Mejora en precisión: ${progreso.mejoraPrecision}%
        Último ejercicio: ${progreso.ultimoEjercicio}
      `;

      const feedback = await iaService.generarMotivacion(mensajeProgreso);
      return feedback;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sugerirProximosEjercicios = useCallback(async (historial: {
    ejerciciosRealizados: string[];
    dificultadesIdentificadas: string[];
    nivelActual: string;
  }, perfilPaciente?: PerfilPaciente) => {
    setIsLoading(true);
    setError(null);

    try {
      const sugerencias = await iaService.sugerirEjercicios(
        historial.nivelActual,
        historial.dificultadesIdentificadas,
        perfilPaciente
      );
      return sugerencias;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const evaluarProgreso = useCallback(async (datosEjercicio: {
    precision: number;
    velocidad: number;
    consistencia: number;
    figura: string;
    intentos: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const descripcion = `
        Ejercicio: ${datosEjercicio.figura}
        Precisión: ${datosEjercicio.precision}%
        Velocidad: ${datosEjercicio.velocidad} segundos
        Consistencia: ${datosEjercicio.consistencia}%
        Intentos realizados: ${datosEjercicio.intentos}
      `;

      const evaluacion = await iaService.analizarTrazado(descripcion, datosEjercicio.figura);
      return evaluacion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    analizarEjercicio,
    generarFeedback,
    sugerirProximosEjercicios,
    evaluarProgreso,
    limpiarError
  };
};

// Servicio para integración con IA a través del backend
import { BASE_URL, getHeaders } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class OpenAIService {
  constructor() {
    // Ahora usamos el backend para todas las llamadas a IA
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      // Convertir mensajes a formato de chat general
      const lastUserMessage = messages.find(msg => msg.role === 'user')?.content || '';
      
      const response = await fetch(`${BASE_URL}/dibujos/chat-general-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          mensaje: lastUserMessage
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.respuesta || 'No se pudo obtener respuesta';
    } catch (error) {
      console.error('Error al enviar mensaje a IA:', error);
      throw error;
    }
  }

  async evaluarCoordenadas(
    coordenadasModelo: Array<{ x: number; y: number }>,
    coordenadasPaciente: Array<{ x: number; y: number }>,
    figuraObjetivo: string,
    puntuacionEstrellas: number
  ): Promise<{
    estrellasIA: number;
    analisis: string;
    sugerencias: string[];
  }> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/evaluar-coordenadas-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          coordenadas_modelo: coordenadasModelo,
          coordenadas_paciente: coordenadasPaciente,
          figura_objetivo: figuraObjetivo,
          puntuacion_original: puntuacionEstrellas
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        estrellasIA: data.data.estrellas_ia,
        analisis: data.data.analisis,
        sugerencias: data.data.sugerencias
      };
    } catch (error) {
      console.error('Error en evaluación IA:', error);
      return {
        estrellasIA: puntuacionEstrellas,
        analisis: 'Error al evaluar con IA. Usando puntuación automática.',
        sugerencias: []
      };
    }
  }

  async sugerirEjercicios(
    nivelActual: string, 
    dificultades: string[], 
    perfilPaciente?: { nombre: string; id: string; edad?: string; diagnostico?: string }
  ): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/sugerir-ejercicios-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          nivel_actual: nivelActual,
          dificultades: dificultades,
          perfil_paciente: perfilPaciente
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.sugerencias;
    } catch (error) {
      console.error('Error al sugerir ejercicios:', error);
      throw error;
    }
  }

  async generarMotivacion(progreso: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/generar-motivacion-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          progreso: progreso
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.motivacion;
    } catch (error) {
      console.error('Error al generar motivación:', error);
      throw error;
    }
  }

  async chatGeneral(
    mensaje: string, 
    perfilPaciente?: { nombre: string; id: string; edad?: string; diagnostico?: string }
  ): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/chat-general-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          mensaje: mensaje,
          perfil_paciente: perfilPaciente
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.respuesta;
    } catch (error) {
      console.error('Error en chat general:', error);
      throw error;
    }
  }

  async generarFeedbackPersonalizado(
    progreso: string,
    perfilPaciente: { nombre: string; id: string; edad?: string; diagnostico?: string }
  ): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/generar-feedback-personalizado-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          progreso: progreso,
          perfil_paciente: perfilPaciente
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.feedback;
    } catch (error) {
      console.error('Error al generar feedback personalizado:', error);
      throw error;
    }
  }

  async generarResumenNivel1(
    perfilPaciente: { nombre: string; id: string; edad?: string; diagnostico?: string },
    tipoEjercicio: string,
    precisiones: number[],
    promedioPrecision: number,
    ejerciciosCompletados: number,
    nivel?: number
  ): Promise<{
    resumen: string;
    fortalezas: string[];
    areasMejora: string[];
    recomendaciones: string[];
  }> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/generar-resumen-nivel-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          perfil_paciente: perfilPaciente,
          tipo_ejercicio: tipoEjercicio,
          precisiones: precisiones,
          promedio_precision: promedioPrecision,
          ejercicios_completados: ejerciciosCompletados,
          nivel: nivel
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        resumen: data.data.resumen,
        fortalezas: data.data.fortalezas,
        areasMejora: data.data.areas_mejora,
        recomendaciones: data.data.recomendaciones
      };
    } catch (error) {
      console.error('Error en resumen IA:', error);
      const siguienteNivel = nivel ? nivel + 1 : 2;
      return {
        resumen: `¡Excelente trabajo ${perfilPaciente.nombre}! Has completado ${ejerciciosCompletados} ejercicios.`,
        fortalezas: ['Completaste todos los ejercicios'],
        areasMejora: ['Continuar practicando'],
        recomendaciones: [`Seguir con el nivel ${siguienteNivel}`]
      };
    }
  }

  async analizarTrazado(descripcionTrazado: string, figuraObjetivo: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/dibujos/analizar-trazado-ia`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          descripcion_trazado: descripcionTrazado,
          figura_objetivo: figuraObjetivo
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.analisis;
    } catch (error) {
      console.error('Error al analizar trazado:', error);
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();

// Servicio para integración con IA a través del backend
import { BASE_URL, getHeaders } from "./api"

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface EvaluacionIA {
  estrellas_ia: number;
  analisis: string;
  sugerencias: string[];
}

export interface ResumenIA {
  resumen: string;
  fortalezas: string[];
  areas_mejora: string[];
  recomendaciones: string[];
}

export interface PerfilPaciente {
  nombre: string;
  id: string;
  edad?: string;
  diagnostico?: string;
}

class IAService {
  // Evaluar coordenadas de dibujo con IA
  async evaluarCoordenadas(
    coordenadasModelo: Array<{ x: number; y: number }>,
    coordenadasPaciente: Array<{ x: number; y: number }>,
    figuraObjetivo: string,
    puntuacionEstrellas: number
  ): Promise<EvaluacionIA> {
    try {
      console.log('🔍 iaService - Enviando datos al backend:', {
        coordenadasModelo: coordenadasModelo.length,
        coordenadasPaciente: coordenadasPaciente.length,
        figuraObjetivo,
        puntuacionEstrellas,
        muestraModelo: coordenadasModelo.slice(0, 3),
        muestraPaciente: coordenadasPaciente.slice(0, 3)
      });

      const res = await fetch(`${BASE_URL}/dibujos/evaluar-coordenadas-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          coordenadas_modelo: coordenadasModelo,
          coordenadas_paciente: coordenadasPaciente,
          figura_objetivo: figuraObjetivo,
          puntuacion_original: puntuacionEstrellas
        })
      });

      console.log('🔍 iaService - Respuesta del backend:', {
        status: res.status,
        ok: res.ok
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error('❌ iaService - Error del backend:', error);
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('🔍 iaService - Datos recibidos del backend:', data);

      const resultado = {
        estrellas_ia: data.data.estrellas_ia,
        analisis: data.data.analisis,
        sugerencias: data.data.sugerencias
      };

      console.log('🔍 iaService - Resultado procesado:', resultado);
      return resultado;
    } catch (error) {
      console.error('Error al evaluar coordenadas con IA:', error);
      throw error;
    }
  }

  // Sugerir ejercicios con IA
  async sugerirEjercicios(
    nivelActual: string,
    dificultades: string[],
    perfilPaciente?: PerfilPaciente
  ): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/dibujos/sugerir-ejercicios-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          nivel_actual: nivelActual,
          dificultades: dificultades,
          perfil_paciente: perfilPaciente
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data.data.sugerencias;
    } catch (error) {
      console.error('Error al sugerir ejercicios con IA:', error);
      throw error;
    }
  }

  // Generar motivación con IA
  async generarMotivacion(progreso: string): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/dibujos/generar-motivacion-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          progreso: progreso
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data.data.motivacion;
    } catch (error) {
      console.error('Error al generar motivación con IA:', error);
      throw error;
    }
  }

  // Chat general con IA
  async chatGeneral(
    mensaje: string,
    perfilPaciente?: PerfilPaciente
  ): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/dibujos/chat-general-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          mensaje: mensaje,
          perfil_paciente: perfilPaciente
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data.data.respuesta;
    } catch (error) {
      console.error('Error en chat general con IA:', error);
      throw error;
    }
  }

  // Generar feedback personalizado con IA
  async generarFeedbackPersonalizado(
    progreso: string,
    perfilPaciente: PerfilPaciente
  ): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/dibujos/generar-feedback-personalizado-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          progreso: progreso,
          perfil_paciente: perfilPaciente
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data.data.feedback;
    } catch (error) {
      console.error('Error al generar feedback personalizado con IA:', error);
      throw error;
    }
  }

  // Generar resumen de nivel con IA
  async generarResumenNivel(
    perfilPaciente: PerfilPaciente,
    tipoEjercicio: string,
    precisiones: number[],
    promedioPrecision: number,
    ejerciciosCompletados: number,
    nivel?: number
  ): Promise<ResumenIA> {
    try {
      console.log('🔍 iaService - Generando resumen de nivel:', {
        perfilPaciente,
        tipoEjercicio,
        precisiones,
        promedioPrecision,
        ejerciciosCompletados,
        nivel
      });

      const res = await fetch(`${BASE_URL}/dibujos/generar-resumen-nivel-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          perfil_paciente: perfilPaciente,
          tipo_ejercicio: tipoEjercicio,
          precisiones: precisiones,
          promedio_precision: promedioPrecision,
          ejercicios_completados: ejerciciosCompletados,
          nivel: nivel
        })
      });

      console.log('🔍 iaService - Respuesta del backend (resumen):', {
        status: res.status,
        ok: res.ok
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error('❌ iaService - Error del backend (resumen):', error);
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('🔍 iaService - Datos recibidos del backend (resumen):', data);
      
      const resultado = data.data;
      console.log('🔍 iaService - Resultado procesado (resumen):', resultado);
      
      return resultado;
    } catch (error) {
      console.error('Error al generar resumen de nivel con IA:', error);
      throw error;
    }
  }

  // Analizar trazado específico con IA
  async analizarTrazado(
    descripcionTrazado: string,
    figuraObjetivo: string
  ): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/dibujos/analizar-trazado-ia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          descripcion_trazado: descripcionTrazado,
          figura_objetivo: figuraObjetivo
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data.data.analisis;
    } catch (error) {
      console.error('Error al analizar trazado con IA:', error);
      throw error;
    }
  }
}

export const iaService = new IAService();


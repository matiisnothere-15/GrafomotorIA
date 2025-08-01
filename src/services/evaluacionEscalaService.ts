import { BASE_URL, getHeaders } from "./api"
import type { EvaluacionEscala } from "../models/EvaluacionEscala"

// Obtener todas las evaluaciones escala
export const obtenerEvaluacionesEscala = async (): Promise<EvaluacionEscala[]> => {
  try {
    const res = await fetch(`${BASE_URL}/evaluaciones/listarevaluaciones`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      console.error("❌ Error al obtener las evaluaciones:", error)
      throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    console.log("✅ Evaluaciones obtenidas:", data)
    return data
  } catch (error) {
    console.error("❌ Error al obtener las evaluaciones:", error)
    throw error
  }
}

// Crear una nueva evaluación escala
export const crearEvaluacionEscala = async (evaluacion: EvaluacionEscala): Promise<boolean> => {
  // Validación mínima
  if (!evaluacion.fecha || !evaluacion.tipo_escala || !evaluacion.resultado || !evaluacion.puntaje || !evaluacion.id_paciente) {
    console.warn("❌ Faltan campos obligatorios en la evaluación.")
    return false
  }

  try {
    const res = await fetch(`${BASE_URL}/evaluaciones/crearevaluaciones`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(evaluacion),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      console.error(`❌ Error al crear la evaluación:`, error)
      return false
    }

    console.log("✅ Evaluación creada con éxito:", evaluacion)
    return true
  } catch (error) {
    console.error("❌ Error al crear la evaluación:", error)
    return false
  }
}

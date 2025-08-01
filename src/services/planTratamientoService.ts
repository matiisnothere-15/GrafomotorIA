import { BASE_URL, getHeaders } from "./api"
import type { PlanTratamiento } from "../models/PlanTratamiento"

// GET: Obtener todos los planes de tratamiento
export const obtenerPlanesTratamiento = async (): Promise<PlanTratamiento[]> => {
  try {
    const res = await fetch(`${BASE_URL}/planes/listarplanes`, {
      method: "GET",
      headers: getHeaders(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    console.log("✅ Planes obtenidos:", data)
    return data
  } catch (error) {
    console.error("❌ Error al obtener los planes:", error)
    throw error
  }
}

// POST: Crear nuevo plan de tratamiento
export const crearPlanTratamiento = async (plan: PlanTratamiento): Promise<PlanTratamiento> => {
  if (!plan || !plan.fecha_inicio || !plan.id_paciente || !plan.id_usuario) {
    throw new Error("❌ Faltan campos obligatorios para el plan.")
  }

  try {
    const res = await fetch(`${BASE_URL}/planes/crearplanes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(plan),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    console.log("✅ Plan creado:", data)
    return data
  } catch (error) {
    console.error("❌ Error al crear el plan:", error)
    throw error
  }
}

// PUT: Actualizar plan de tratamiento existente
export const actualizarPlanTratamiento = async (
  id_plan: number,
  plan: PlanTratamiento
): Promise<PlanTratamiento> => {
  try {
    const res = await fetch(`${BASE_URL}/planes/editarplan/${id_plan}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(plan),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.msg || `Error ${res.status}: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    console.error("❌ Error al actualizar el plan:", error)
    throw error
  }
}

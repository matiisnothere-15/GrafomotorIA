import { BASE_URL, getHeaders } from "./api"
import type { ResumenAvance } from "../models/ResumenAvance"

// GET: Listar todos los resúmenes
export const obtenerResumenes = async (): Promise<ResumenAvance[]> => {
  const res = await fetch(`${BASE_URL}/resumenes/listar`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener los resúmenes")
  }

  return await res.json()
}

// GET: Obtener un resumen por ID
export const obtenerResumenPorId = async (id: number): Promise<ResumenAvance> => {
  const res = await fetch(`${BASE_URL}/resumenes/mostrar/${id}`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Resumen no encontrado")
  }

  return await res.json()
}

// POST: Crear resumen de avance
export const crearResumen = async (
  data: Omit<ResumenAvance, "id_resumen_avance">
): Promise<ResumenAvance> => {
  const res = await fetch(`${BASE_URL}/resumenes/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear resumen")
  }

  return await res.json()
}

// PUT: Actualizar resumen existente
export const actualizarResumen = async (
  id: number,
  data: Partial<ResumenAvance>
): Promise<ResumenAvance> => {
  const res = await fetch(`${BASE_URL}/resumenes/actualizar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar resumen")
  }

  return await res.json()
}

// DELETE: Eliminar resumen
export const eliminarResumen = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/resumenes/eliminar/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar resumen")
  }
}

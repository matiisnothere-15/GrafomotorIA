import { BASE_URL, getHeaders } from "./api"
import type { SeguimientoProgreso } from "../models/SeguimientoProgreso"

// GET: Listar todos los seguimientos
export const obtenerSeguimientos = async (): Promise<SeguimientoProgreso[]> => {
  const res = await fetch(`${BASE_URL}/seguimiento`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener seguimientos")
  }

  return await res.json()
}

// GET: Obtener seguimiento por ID
export const obtenerSeguimientoPorId = async (id: number): Promise<SeguimientoProgreso> => {
  const res = await fetch(`${BASE_URL}/seguimiento/${id}`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Seguimiento no encontrado")
  }

  return await res.json()
}

// POST: Crear seguimiento de progreso
export const crearSeguimiento = async (data: SeguimientoProgreso): Promise<SeguimientoProgreso> => {
  const res = await fetch(`${BASE_URL}/seguimiento`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear seguimiento")
  }

  return await res.json()
}

// PUT: Actualizar seguimiento
export const actualizarSeguimiento = async (
  id: number,
  data: SeguimientoProgreso
): Promise<SeguimientoProgreso> => {
  const res = await fetch(`${BASE_URL}/seguimiento/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar seguimiento")
  }

  return await res.json()
}

// DELETE: Eliminar seguimiento
export const eliminarSeguimiento = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/seguimiento/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar seguimiento")
  }
}

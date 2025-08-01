import { BASE_URL, getHeaders } from "./api"
import type { DetalleSesion } from "../models/DetalleSesion"

// GET: Listar todos los detalles
export const obtenerDetallesSesion = async (): Promise<DetalleSesion[]> => {
  const res = await fetch(`${BASE_URL}/detalles/listardetalles`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener los detalles de sesión")
  }

  return await res.json()
}

// GET: Obtener un detalle por ID
export const obtenerDetalleSesionPorId = async (id: number): Promise<DetalleSesion> => {
  const res = await fetch(`${BASE_URL}/detalles/mostrardetalles/${id}`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Detalle de sesión no encontrado")
  }

  return await res.json()
}

// POST: Crear nuevo detalle
export const crearDetalleSesion = async (data: DetalleSesion): Promise<DetalleSesion> => {
  const res = await fetch(`${BASE_URL}/detalles/creardetalles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear detalle de sesión")
  }

  return await res.json()
}

// PUT: Actualizar detalle existente
export const actualizarDetalleSesion = async (id: number, data: DetalleSesion): Promise<DetalleSesion> => {
  const res = await fetch(`${BASE_URL}/detalles/actualizardetalles/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar detalle de sesión")
  }

  return await res.json()
}

// DELETE: Eliminar detalle
export const eliminarDetalleSesion = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/detalles/eliminardetalles/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar detalle de sesión")
  }
}

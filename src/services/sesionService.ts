import { BASE_URL, getHeaders } from "./api"
import type { Sesion } from "../models/Sesion"

// GET: Obtener todas las sesiones
export const obtenerSesiones = async (): Promise<Sesion[]> => {
  const res = await fetch(`${BASE_URL}/sesiones/listarsesiones`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener sesiones")
  }

  return await res.json()
}

// GET: Obtener sesión por ID
export const obtenerSesionPorId = async (id: number): Promise<Sesion> => {
  const res = await fetch(`${BASE_URL}/sesiones/mostrarsesiones/${id}`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Sesión no encontrada")
  }

  return await res.json()
}

// POST: Crear nueva sesión
export const crearSesion = async (data: Sesion): Promise<Sesion> => {
  const res = await fetch(`${BASE_URL}/sesiones/crearsesiones`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear sesión")
  }

  return await res.json()
}

// PUT: Actualizar sesión
export const actualizarSesion = async (
  id: number,
  data: Sesion
): Promise<Sesion> => {
  const res = await fetch(`${BASE_URL}/sesiones/actualizarsesiones/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar sesión")
  }

  return await res.json()
}

// DELETE: Eliminar sesión
export const eliminarSesion = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/sesiones/eliminarsesiones/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar sesión")
  }
}

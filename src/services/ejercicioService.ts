import { BASE_URL, getHeaders } from "./api"
import type { Ejercicio } from "../models/Ejercicio"

// GET: Obtener todos los ejercicios
export const obtenerEjercicios = async (): Promise<Ejercicio[]> => {
  const res = await fetch(`${BASE_URL}/ejercicios/listarejercicios`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener ejercicios")
  }

  return await res.json()
}

// GET: Obtener un ejercicio por ID
export const obtenerEjercicioPorId = async (id: number): Promise<Ejercicio> => {
  const res = await fetch(`${BASE_URL}/ejercicios/mostrarejercicios/${id}`, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Ejercicio no encontrado")
  }

  return await res.json()
}

// POST: Crear ejercicio
export const crearEjercicio = async (data: Ejercicio): Promise<Ejercicio> => {
  const res = await fetch(`${BASE_URL}/ejercicios/crearejercicios`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear ejercicio")
  }

  return await res.json()
}

// PUT: Actualizar ejercicio
export const actualizarEjercicio = async (id: number, data: Ejercicio): Promise<Ejercicio> => {
  const res = await fetch(`${BASE_URL}/ejercicios/actualizarejercicios/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar ejercicio")
  }

  return await res.json()
}

// DELETE: Eliminar ejercicio
export const eliminarEjercicio = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/ejercicios/eliminarejercicios/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar ejercicio")
  }
}

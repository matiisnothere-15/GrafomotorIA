import { BASE_URL, getHeaders } from "./api"
import type { Tutor } from "../models/Tutor"

// GET: Listar todos los tutores
export const getTutores = async (): Promise<Tutor[]> => {
  const res = await fetch(`${BASE_URL}/tutor`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener tutores")
  }

  return await res.json()
}

// GET: Obtener tutor por ID
export const getTutorById = async (id: number): Promise<Tutor> => {
  const res = await fetch(`${BASE_URL}/tutor/${id}`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Tutor no encontrado")
  }

  return await res.json()
}

// POST: Crear nuevo tutor
export const createTutor = async (data: Tutor): Promise<Tutor> => {
  const res = await fetch(`${BASE_URL}/tutor`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear tutor")
  }

  return await res.json()
}

// PUT: Actualizar tutor
export const updateTutor = async (id: number, data: Tutor): Promise<Tutor> => {
  const res = await fetch(`${BASE_URL}/tutor/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar tutor")
  }

  return await res.json()
}

// DELETE: Eliminar tutor
export const deleteTutor = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tutor/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar tutor")
  }
}

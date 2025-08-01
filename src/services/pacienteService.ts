import { BASE_URL, getHeaders } from "./api"
import type { Paciente } from "../models/Paciente"

// GET: Listar todos los pacientes
export const obtenerPacientes = async (): Promise<Paciente[]> => {
  const res = await fetch(`${BASE_URL}/pacientes/listarpacientes`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al obtener pacientes")
  }

  return await res.json()
}

// GET: Obtener paciente por ID
export const getPacienteById = async (id: number): Promise<Paciente> => {
  const res = await fetch(`${BASE_URL}/pacientes/mostrarpaciente/${id}`, {
    method: "GET",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Paciente no encontrado")
  }

  return await res.json()
}

// POST: Crear nuevo paciente
export const createPaciente = async (data: Paciente): Promise<Paciente> => {
  const res = await fetch(`${BASE_URL}/pacientes/crearpaciente`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al crear paciente")
  }

  return await res.json()
}

// PUT: Actualizar paciente existente (usando nueva ruta)
export const actualizarPaciente = async (id: number | string, data: any): Promise<Paciente> => {
  const res = await fetch(`${BASE_URL}/pacientes/editarpaciente/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar paciente")
  }

  return await res.json()
}

// DELETE: Eliminar paciente
export const deletePaciente = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/pacientes/eliminarpaciente/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al eliminar paciente")
  }
}

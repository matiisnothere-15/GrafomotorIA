import { BASE_URL } from "../config.ts";
import type { Paciente } from "../models/Paciente.ts";

export const getPacientes = async (): Promise<Paciente[]> => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/pacientes/listarpacientes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener pacientes");
  return await res.json();
};


export const getPacienteById = async (id: number): Promise<Paciente> => {
  const res = await fetch(`${BASE_URL}/paciente/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Paciente no encontrado");
  return await res.json();
};

export const createPaciente = async (data: Paciente) => {
  const res = await fetch(`${BASE_URL}/paciente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear paciente");
  return await res.json();
};

export const updatePaciente = async (id: number, data: Paciente) => {
  const res = await fetch(`${BASE_URL}/paciente/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar paciente");
  return await res.json();
};

export const deletePaciente = async (id: number) => {
  const res = await fetch(`${BASE_URL}/paciente/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar paciente");
};


export const actualizarPaciente = async (id: string | number, datos: any) => {
  const res = await fetch(`${BASE_URL}/pacientes/editarpaciente/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw new Error('Error al actualizar paciente');
  return await res.json();
};

export const obtenerPacientes = async () => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/pacientes/listarpacientes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener pacientes");
  return await res.json();
};

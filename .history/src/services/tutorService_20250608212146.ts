import { BASE_URL } from "../config.ts";
import type { Tutor } from "../models/Tutor.ts";

export const getTutores = async (): Promise<Tutor[]> => {
  const res = await fetch(`${BASE_URL}/tutor`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error al obtener tutores");
  return await res.json();
};

export const getTutorById = async (id: number): Promise<Tutor> => {
  const res = await fetch(`${BASE_URL}/tutor/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Tutor no encontrado");
  return await res.json();
};

export const createTutor = async (data: Tutor): Promise<Tutor> => {
  const res = await fetch(`${BASE_URL}/tutor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear tutor");
  return await res.json();
};

export const updateTutor = async (id: number, data: Tutor): Promise<Tutor> => {
  const res = await fetch(`${BASE_URL}/tutor/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar tutor");
  return await res.json();
};

export const deleteTutor = async (id: number) => {
  const res = await fetch(`${BASE_URL}/tutor/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error al eliminar tutor");
};
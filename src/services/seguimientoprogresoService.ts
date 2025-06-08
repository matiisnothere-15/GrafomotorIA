import { BASE_URL } from "../config.ts";
import type { SeguimientoProgreso } from "../models/SeguimientoProgreso.ts";

export const obtenerSeguimientos = async (): Promise<SeguimientoProgreso[]> => {
  const res = await fetch(`${BASE_URL}/seguimiento`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener seguimientos");
  return await res.json();
};

export const obtenerSeguimientoPorId = async (id: number): Promise<SeguimientoProgreso> => {
  const res = await fetch(`${BASE_URL}/seguimiento/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Seguimiento no encontrado");
  return await res.json();
};

export const crearSeguimiento = async (data: SeguimientoProgreso) => {
  const res = await fetch(`${BASE_URL}/seguimiento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear seguimiento");
  return await res.json();
};

export const actualizarSeguimiento = async (id: number, data: SeguimientoProgreso) => {
  const res = await fetch(`${BASE_URL}/seguimiento/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar seguimiento");
  return await res.json();
};

export const eliminarSeguimiento = async (id: number) => {
  const res = await fetch(`${BASE_URL}/seguimiento/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar seguimiento");
};

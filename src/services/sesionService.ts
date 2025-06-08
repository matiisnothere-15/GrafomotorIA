import { BASE_URL } from "../config.ts";
import type { Sesion } from "../models/Sesion";

export const obtenerSesiones = async (): Promise<Sesion[]> => {
  const res = await fetch(`${BASE_URL}/sesion`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener sesiones");
  return await res.json();
};

export const obtenerSesionPorId = async (id: number): Promise<Sesion> => {
  const res = await fetch(`${BASE_URL}/sesion/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Sesión no encontrada");
  return await res.json();
};

export const crearSesion = async (data: Sesion) => {
  const res = await fetch(`${BASE_URL}/sesion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear sesión");
  return await res.json();
};

export const actualizarSesion = async (id: number, data: Sesion) => {
  const res = await fetch(`${BASE_URL}/sesion/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar sesión");
  return await res.json();
};

export const eliminarSesion = async (id: number) => {
  const res = await fetch(`${BASE_URL}/sesion/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar sesión");
};

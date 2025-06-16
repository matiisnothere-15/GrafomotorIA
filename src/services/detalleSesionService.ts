import { BASE_URL } from "../config";
import type { DetalleSesion } from "../models/DetalleSesion";

const getHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const obtenerDetallesSesion = async (): Promise<DetalleSesion[]> => {
  const res = await fetch(`${BASE_URL}/detalles/listardetalles`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener los detalles de sesión");
  return await res.json();
};

export const obtenerDetalleSesionPorId = async (id: number): Promise<DetalleSesion> => {
  const res = await fetch(`${BASE_URL}/detalles/mostrardetalles/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Detalle de sesión no encontrado");
  return await res.json();
};

export const crearDetalleSesion = async (data: DetalleSesion) => {
  const res = await fetch(`${BASE_URL}/detalles/creardetalles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear detalle de sesión");
  return await res.json();
};

export const actualizarDetalleSesion = async (id: number, data: DetalleSesion) => {
  const res = await fetch(`${BASE_URL}/detalles/actualizardetalles/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar detalle de sesión");
  return await res.json();
};

export const eliminarDetalleSesion = async (id: number) => {
  const res = await fetch(`${BASE_URL}/detalles/eliminardetalles/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar detalle de sesión");
};

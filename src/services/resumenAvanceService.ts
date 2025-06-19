import { BASE_URL } from "../config";
import type { ResumenAvance } from "../models/ResumenAvance";

const getHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const obtenerResumenes = async (): Promise<ResumenAvance[]> => {
  const res = await fetch(`${BASE_URL}/resumenes/listar`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener los resúmenes");
  return await res.json();
};

export const obtenerResumenPorId = async (id: number): Promise<ResumenAvance> => {
  const res = await fetch(`${BASE_URL}/resumenes/mostrar/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Resumen no encontrado");
  return await res.json();
};

export const crearResumen = async (
  data: Omit<ResumenAvance, "id_resumen_avance">
): Promise<ResumenAvance> => {
  const res = await fetch(`${BASE_URL}/resumenes/crear`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear resumen");
  return await res.json();
};

export const actualizarResumen = async (
  id: number,
  data: Partial<ResumenAvance>
): Promise<ResumenAvance> => {
  const res = await fetch(`${BASE_URL}/resumenes/actualizar/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar resumen");
  return await res.json();
};

export const eliminarResumen = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/resumenes/eliminar/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar resumen");
};

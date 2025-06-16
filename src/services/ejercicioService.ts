import { BASE_URL } from "../config";
import type { Ejercicio } from "../models/Ejercicio";

const getHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const obtenerEjercicios = async (): Promise<Ejercicio[]> => {
  const res = await fetch(`${BASE_URL}/ejercicios/listarejercicios`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener ejercicios");
  return await res.json();
};

export const obtenerEjercicioPorId = async (id: number): Promise<Ejercicio> => {
  const res = await fetch(`${BASE_URL}/ejercicios/mostrarejercicios/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Ejercicio no encontrado");
  return await res.json();
};

export const crearEjercicio = async (data: Ejercicio) => {
  const res = await fetch(`${BASE_URL}/ejercicios/crearejercicios`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear ejercicio");
  return await res.json();
};

export const actualizarEjercicio = async (id: number, data: Ejercicio) => {
  const res = await fetch(`${BASE_URL}/ejercicios/actualizarejercicios/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar ejercicio");
  return await res.json();
};

export const eliminarEjercicio = async (id: number) => {
  const res = await fetch(`${BASE_URL}/ejercicios/eliminarejercicios/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar ejercicio");
};

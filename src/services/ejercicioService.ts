import { BASE_URL } from "../config";
import type { Ejercicio } from "../models/Ejercicio";

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const obtenerEjercicios = async (): Promise<Ejercicio[]> => {
  const res = await fetch(`${BASE_URL}/api/ejercicios/listarejercicios`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener ejercicios");
  return await res.json();
};

export const obtenerEjercicioPorId = async (id: number): Promise<Ejercicio> => {
  const res = await fetch(`${BASE_URL}/api/ejercicios/mostrarejercicios/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Ejercicio no encontrado");
  return await res.json();
};

export const crearEjercicio = async (data: Ejercicio) => {
  const res = await fetch(`${BASE_URL}/api/ejercicios/crearejercicios`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear ejercicio");
  return await res.json();
};

export const actualizarEjercicio = async (id: number, data: Ejercicio) => {
  const res = await fetch(`${BASE_URL}/api/ejercicios/actualizarejercicios/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar ejercicio");
  return await res.json();
};

export const eliminarEjercicio = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/ejercicios/eliminarejercicios/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar ejercicio");
};

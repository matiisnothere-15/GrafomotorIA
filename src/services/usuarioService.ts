//import type { Usuario } from "../models/Usuario";
import { BASE_URL } from "../config.ts";

interface LoginResponse {
    token: string;
}

export const loginUsuario = async (email: string, password: string): Promise<LoginResponse> => {
  const data = {
    correo: email,
    contrasena: password,
  };

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Credenciales inválidas');

  const respuesta = await res.json();

  sessionStorage.setItem('token', respuesta.access_token);
  sessionStorage.setItem('nombre', respuesta.nombre);
  sessionStorage.setItem('apellido', respuesta.apellido);
  sessionStorage.setItem('tipo_usuario', respuesta.tipo_usuario);

  return respuesta;
};
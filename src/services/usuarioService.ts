
import { BASE_URL } from "../config.ts";

interface LoginResponse {
  access_token: string;
  nombre: string;
  apellido: string;
  tipo_usuario: string;
}

export const loginUsuario = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const data = {
    correo: email,
    contrasena: password,
  };

  const res = await fetch(`${BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");

  const respuesta: LoginResponse = await res.json();

  // Guardamos los datos en sessionStorage
  sessionStorage.setItem("token", respuesta.access_token);
  sessionStorage.setItem("nombre", respuesta.nombre);
  sessionStorage.setItem("apellido", respuesta.apellido);
  sessionStorage.setItem("tipo_usuario", respuesta.tipo_usuario);

  return respuesta;
};


export const enviarCodigo = async (correo: string) => {
  const data = {
    correo: correo
  }

  try {
    const res = await fetch(`${BASE_URL}/usuarios/solicitar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if(res.status == 404) {
      const respuesta = await res.json();
      return respuesta;
    } else {
      return true;
    }

  } catch(e) {
    console.log(e);
    return false;
  }
}

export const verificarCodigo = async (correo: string, codigo: string) => {
  const data = {
    correo: correo,
    codigo: codigo
  }
  
  try {
    const res = await fetch(`${BASE_URL}/usuarios/verificar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if(res.status == 400) {
      const respuesta = await res.json();
      return respuesta;
    } else {
      return true;
    }

  } catch(e) {
    console.log(e);
    return false;
  }
}

export const cambiarContrasena = async (correo: string, contrasena: string) => {
  const data = {
    correo: correo,
    contrasena: contrasena
  }

  try {
    const res = await fetch(`${BASE_URL}/usuarios/resetear-contrasena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if(res.status == 400 || res.status == 404 || res.status == 401) {
      const respuesta = await res.json();
      return respuesta;
    } else {
      return true;
    }

  } catch(e) {
    console.log(e);
    return false;
  }
}
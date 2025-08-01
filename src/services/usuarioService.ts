import { BASE_URL, getHeaders } from "./api"

interface LoginResponse {
  access_token: string
  nombre: string
  apellido: string
  tipo_usuario: string
  id_usuario: number
  imagen: string | null
}

// LOGIN
export const loginUsuario = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const data = { correo: email, contrasena: password }

  const res = await fetch(`${BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Credenciales inválidas")

  const respuesta: LoginResponse = await res.json()

  sessionStorage.setItem("token", respuesta.access_token)
  sessionStorage.setItem("nombre", respuesta.nombre)
  sessionStorage.setItem("apellido", respuesta.apellido)
  sessionStorage.setItem("tipo_usuario", respuesta.tipo_usuario)
  sessionStorage.setItem("id_usuario", respuesta.id_usuario.toString())
  sessionStorage.setItem("imagen", respuesta.imagen || "")

  return respuesta
}

// ENVIAR CÓDIGO DE RECUPERACIÓN
export const enviarCodigo = async (correo: string): Promise<boolean | any> => {
  const data = { correo }

  try {
    const res = await fetch(`${BASE_URL}/usuarios/solicitar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (res.status === 404) {
      return await res.json()
    }

    return true
  } catch (e) {
    console.error("❌ Error enviando código:", e)
    return false
  }
}

// VERIFICAR CÓDIGO
export const verificarCodigo = async (
  correo: string,
  codigo: string
): Promise<boolean | any> => {
  const data = { correo, codigo }

  try {
    const res = await fetch(`${BASE_URL}/usuarios/verificar-codigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (res.status === 400) {
      return await res.json()
    }

    return true
  } catch (e) {
    console.error("❌ Error verificando código:", e)
    return false
  }
}

// CAMBIAR CONTRASEÑA
export const cambiarContrasena = async (
  correo: string,
  contrasena: string
): Promise<boolean | any> => {
  const data = { correo, contrasena }

  try {
    const res = await fetch(`${BASE_URL}/usuarios/resetear-contrasena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if ([400, 404, 401].includes(res.status)) {
      return await res.json()
    }

    return true
  } catch (e) {
    console.error("❌ Error al cambiar contraseña:", e)
    return false
  }
}

// ACTUALIZAR IMAGEN DE USUARIO
export const actualizarImagenUsuario = async (
  id_usuario: number,
  imagenBase64: string
): Promise<any> => {
  const res = await fetch(`${BASE_URL}/usuarios/${id_usuario}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ imagen: imagenBase64 }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.msg || "Error al actualizar imagen")
  }

  return await res.json()
}

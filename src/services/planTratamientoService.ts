import { BASE_URL } from "../config.ts";

// Obtener token desde sessionStorage
const getToken = () => sessionStorage.getItem("token") || "";

// Obtener todos los planes de tratamiento
export const obtenerPlanesTratamiento = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/planes/listarplanes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    }) as Response;

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    console.log("✅ Planes obtenidos:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al obtener los planes:", error);
    throw error;
  }
};

// Crear un nuevo plan de tratamiento
export const crearPlanTratamiento = async (plan) => {
  // Validación mínima
  if (!plan || !plan.fecha_inicio || !plan.nombre || !plan.rut) {
    throw new Error("❌ Faltan campos obligatorios.");
  }

  try {
    const res = await fetch(`${BASE_URL}/api/planes/crearplanes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(plan),
    }) as Response;

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    console.log("✅ Plan creado:", plan);
  } catch (error) {
    console.error("❌ Error al crear el plan:", error);
    throw error;
  }
};

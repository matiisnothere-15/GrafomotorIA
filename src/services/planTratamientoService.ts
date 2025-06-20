import { BASE_URL } from "../config.ts";
import type { PlanTratamiento } from "../models/PlanTratamiento";

const getToken = () => sessionStorage.getItem("token") || "";

export const obtenerPlanesTratamiento = async () => {
  try {
    const res = await fetch(`${BASE_URL}/planes/listarplanes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

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
export const crearPlanTratamiento = async (plan: PlanTratamiento) => {
  // Validación mínima basada en backend
  if (!plan || !plan.fecha_inicio || !plan.id_paciente || !plan.id_usuario) {
    throw new Error("❌ Faltan campos obligatorios.");
  }

  try {
    const res = await fetch(`${BASE_URL}/planes/crearplanes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(plan),
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    console.log("✅ Plan creado:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al crear el plan:", error);
    throw error;
  }
};

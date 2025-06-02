import { BASE_URL } from "../config.ts";
import type { EvaluacionEscala } from "../models/EvaluacionEscala.ts";

// Obtener token desde sessionStorage
const getToken = () => sessionStorage.getItem("token") || "";

// Obtener todos las evaluaciones escala
export const obtenerEvaluacionesEscala = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/evaluaciones/listarevaluaciones`, {
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
export const crearPlanTratamiento = async (evaluacion: EvaluacionEscala) => {
  // Validación mínima
  if (!evaluacion.fecha || !evaluacion.tipo_escala || evaluacion.resultado || evaluacion.puntaje || evaluacion.id_paciente) {
    throw new Error("❌ Faltan campos obligatorios.");
  }

  try {
    const res = await fetch(`${BASE_URL}/api/evaluaciones/crearevaluaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(evaluacion),
    }) as Response;

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    console.log("✅ Plan creado:", evaluacion);
  } catch (error) {
    console.error("❌ Error al crear el plan:", error);
    throw error;
  }
};

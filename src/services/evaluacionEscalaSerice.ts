import { BASE_URL } from "../config.ts";
import type { EvaluacionEscala } from "../models/EvaluacionEscala.ts";

// Obtener token desde sessionStorage
const getToken = () => sessionStorage.getItem("token") || "";

// Obtener todos las evaluaciones escala
export const obtenerEvaluacionesEscala = async () => {
  try {
    const res = await fetch(`${BASE_URL}/evaluaciones/listarevaluaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    }) as Response;

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    console.log("✅ Evaluaciones obtenidas:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al obtener las evaluaciones:", error);
    throw error;
  }
};

// Crear un nueva evaluacion escala
export const crearEvaluacionEscala = async (evaluacion: EvaluacionEscala) => {
  // Validación mínima
  if (!evaluacion.fecha || !evaluacion.tipo_escala || !evaluacion.resultado || !evaluacion.puntaje || !evaluacion.id_paciente) {
    console.log("❌ Faltan campos obligatorios.");
    return false;
  }

  try {
    const res = await fetch(`${BASE_URL}/evaluaciones/crearevaluaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(evaluacion),
    }) as Response;

    if (!res.ok) {
      console.log(`Error ${res.status}: ${res.statusText}`);
      return false
    }

    console.log("✅ Evaluacion creada:", evaluacion);
    return true;
  } catch (error) {
    console.error("❌ Error al crear la evaluacion:", error);
    return false;
  }
};

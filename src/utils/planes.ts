import type { PlanTratamiento } from "../models/PlanTratamiento";

/**
 * Obtiene el plan más reciente de un paciente por fecha de inicio.
 */
export function getPlanReciente(
  planes: PlanTratamiento[],
  idPaciente: number
): PlanTratamiento | null {
  const planesPaciente = planes.filter((p) => p.id_paciente === idPaciente);
  if (!planesPaciente.length) return null;

  return planesPaciente.sort(
    (a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
  )[0];
}

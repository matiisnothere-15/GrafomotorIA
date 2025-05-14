export interface PlanTratamiento {
  id_plan: number;
  fecha_inicio: string;
  fecha_fin: string;
  objetivo_cortoplazo: string;
  objetivo_largoplazo: string;
  periodicidad: string;
  id_paciente: number;
  id_usuario: number;
}
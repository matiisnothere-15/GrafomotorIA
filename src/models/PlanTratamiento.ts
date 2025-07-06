export interface PlanTratamiento {
  id_plan?: number; 
  fecha_inicio: string;
  fecha_fin: string;
  objetivo_cortoplazo: string;
  objetivo_largoplazo: string;
  periodicidad: string;
  progreso: string;
  id_paciente: number;
  id_usuario: number;
}

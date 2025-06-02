export interface EvaluacionEscala {
  //id_evaluacion: number; -> Autoincremental
  fecha: string;
  tipo_escala: string;
  resultado: JSON;
  puntaje: number;
  id_paciente: number;
}
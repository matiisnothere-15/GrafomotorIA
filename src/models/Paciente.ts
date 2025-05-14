export interface Paciente {
  id_paciente: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  rut: string;
  diagnostico: string;
  alergias: string;
  medicamentos: string;
  nombre_emergencia: string;
  numero_emergencia: string;
  correo: string;
  direccion: string;
  nivel_autonomia: string;
  indice_barthel: number;
  id_tutor: number;
}
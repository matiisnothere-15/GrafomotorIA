import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './seguimiento.css';
import Select from 'react-select';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CircularProgressBar from '../../components/CircularProgressBar'; // Importa el nuevo componente
import { obtenerPacientes } from '../../services/pacienteService';
import { obtenerEvaluacionesEscala } from '../../services/evaluacionEscalaService';
import { obtenerPlanesTratamiento } from '../../services/planTratamientoService';
import { getPlanReciente } from '../../utils/planes';
import type { Paciente } from '../../models/Paciente';
import type { PlanTratamiento } from '../../models/PlanTratamiento';
import type { EvaluacionEscala } from '../../models/EvaluacionEscala';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
);

const NOMBRES_EJERCICIOS: { [key: string]: string } = {
  'escala 2': 'Copia de Figuras',
  'trazado guiado': 'Trazado Guiado',
};

interface ChartData {
  labels: string[];
  datasets: any[];
}

const Seguimientos: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [planes, setPlanes] = useState<PlanTratamiento[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionEscala[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>('');
  const [nombrePaciente, setNombrePaciente] = useState<string>('Seleccione un paciente');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [aciertoTotal, setAciertoTotal] = useState<number>(0);
  const [objetivoCorto, setObjetivoCorto] = useState<string>('N/A');
  const [objetivoLargo, setObjetivoLargo] = useState<string>('N/A');
  const [progresoData, setProgresoData] = useState<ChartData | null>(null);
  const [aciertoEjercicioData, setAciertoEjercicioData] = useState<ChartData | null>(null);
  const [rendimientoReciente, setRendimientoReciente] = useState<{ fortaleza: string, debilidad: string }>({ fortaleza: 'N/A', debilidad: 'N/A' });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setIsLoading(true);
        const [pacientesData, evaluacionesData, planesData] = await Promise.all([
          obtenerPacientes(),
          obtenerEvaluacionesEscala(),
          obtenerPlanesTratamiento()
        ]);
        setPacientes(pacientesData);
        setEvaluaciones(evaluacionesData);
        setPlanes(planesData);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (!pacienteSeleccionado || isLoading) {
      setAciertoTotal(0);
      setProgresoData(null);
      setAciertoEjercicioData(null);
      setRendimientoReciente({ fortaleza: 'N/A', debilidad: 'N/A' });
      setObjetivoCorto('N/A');
      setObjetivoLargo('N/A');
      return;
    }

    const idPaciente = parseInt(pacienteSeleccionado);
    
    const evsPaciente = evaluaciones.filter(e => {
      if (e.id_paciente !== idPaciente) return false;
      
      if (!fechaDesde && !fechaHasta) return true;
      
      const fechaEval = new Date(e.fecha);
      fechaEval.setUTCHours(0, 0, 0, 0);
      
      if (fechaDesde) {
        const desde = new Date(fechaDesde);
        desde.setUTCHours(0,0,0,0);
        if (fechaEval < desde) return false;
      }
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setUTCHours(0,0,0,0);
        if (fechaEval > hasta) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    if (evsPaciente.length === 0) {
        setAciertoTotal(0);
        setProgresoData(null);
        setAciertoEjercicioData(null);
        setRendimientoReciente({fortaleza: 'N/A', debilidad: 'N/A'});
        return;
    }

    const totalPuntaje = evsPaciente.reduce((acc, ev) => acc + ev.puntaje, 0);
    setAciertoTotal(Math.round(totalPuntaje / evsPaciente.length));

    setProgresoData({
      labels: evsPaciente.map(e => new Date(e.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })),
      datasets: [{
        label: 'Puntaje por Sesión (%)',
        data: evsPaciente.map(e => e.puntaje),
        borderColor: '#E30613',
        backgroundColor: 'rgba(227, 6, 19, 0.2)',
        fill: true,
        tension: 0.2
      }]
    });

    const ejercicios: { [key: string]: number[] } = {};
    evsPaciente.forEach(ev => {
      const tipo = NOMBRES_EJERCICIOS[String(ev.tipo_escala).toLowerCase()] || ev.tipo_escala || 'Desconocido';
      if (!ejercicios[tipo]) ejercicios[tipo] = [];
      ejercicios[tipo].push(ev.puntaje);
    });

    const labelsAcierto = Object.keys(ejercicios);
    const dataAcierto = labelsAcierto.map(tipo => {
      const puntajes = ejercicios[tipo];
      return Math.round(puntajes.reduce((a, b) => a + b, 0) / puntajes.length);
    });

    setAciertoEjercicioData({
      labels: labelsAcierto,
      datasets: [{
        label: 'Promedio de Acierto (%)',
        data: dataAcierto,
        backgroundColor: 'rgba(227, 6, 19, 0.6)',
        borderColor: 'rgba(227, 6, 19, 1)',
        borderWidth: 1
      }]
    });

    if(labelsAcierto.length > 0) {
        let fortaleza = labelsAcierto[0], debilidad = labelsAcierto[0];
        let maxPromedio = dataAcierto[0], minPromedio = dataAcierto[0];

        labelsAcierto.forEach((label, i) => {
            if(dataAcierto[i] > maxPromedio) {
                maxPromedio = dataAcierto[i];
                fortaleza = label;
            }
            if(dataAcierto[i] < minPromedio) {
                minPromedio = dataAcierto[i];
                debilidad = label;
            }
        });
        setRendimientoReciente({ fortaleza, debilidad });
    }
    
    const planReciente = getPlanReciente(planes, idPaciente);
    setObjetivoCorto(planReciente?.objetivo_cortoplazo || 'Sin plan asignado');
    setObjetivoLargo(planReciente?.objetivo_largoplazo || 'Sin plan asignado');

  }, [pacienteSeleccionado, fechaDesde, fechaHasta, isLoading, evaluaciones, pacientes, planes]);

  return (
    <div className="seguimientos-wrapper">
      <Header />
      <main className="seguimientos-content">
        <h2 className="titulo-vista">Seguimiento del Paciente</h2>
        <div className="filtros-container">
          <div className="filtros-row">
            <div className="filtros filtros-progreso">
              <label>Paciente:</label>
              <Select
                className="select-paciente"
                options={pacientes.map((p) => ({
                  value: p.id_paciente.toString(),
                  label: `${p.nombre} ${p.apellido}`,
                }))}
                onChange={(opcion) => {
                    const id = opcion ? opcion.value : '';
                    setPacienteSeleccionado(id);
                    const pac = pacientes.find(p => p.id_paciente.toString() === id);
                    setNombrePaciente(pac ? `${pac.nombre} ${pac.apellido}` : 'Seleccione un paciente');
                }}
                placeholder="Buscar paciente..."
                isClearable
                isLoading={isLoading}
                isDisabled={isLoading}
              />
              <label>Desde:</label>
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} disabled={isLoading} />
              <label>Hasta:</label>
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} disabled={isLoading} />
            </div>
          </div>
        </div>

        {isLoading ? <p>Cargando datos...</p> : (
            <div className="grid-dashboard">
            <div className="card ficha-paciente">
                <div className="inicial-circulo">{nombrePaciente.charAt(0)}</div>
                <h3>{nombrePaciente}</h3>
            </div>
            
            <div className="card linea">
                <h3>Progreso del Paciente</h3>
                <div className="chart-container">
                  {progresoData ? <Line data={progresoData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p>Sin datos para mostrar.</p>}
                </div>
            </div>

            <div className="card barras-ejercicio">
                <h3>Acierto por Ejercicio</h3>
                <div className="chart-container">
                  {aciertoEjercicioData ? <Bar data={aciertoEjercicioData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false }} /> : <p>Sin datos para mostrar.</p>}
                </div>
            </div>

            <div className="card objetivos-plan">
                <h3>Objetivos del Plan</h3>
                <p><strong>Corto Plazo:</strong> {objetivoCorto}</p>
                <p><strong>Largo Plazo:</strong> {objetivoLargo}</p>
            </div>

            <div className="card circulo-total">
                <h3>Acierto Promedio General</h3>
                <CircularProgressBar percentage={aciertoTotal} />
                <p className="leyenda-circulo">
                    {aciertoTotal >= 70 ? 'Buen progreso' : aciertoTotal >= 40 ? 'Progreso Aceptable' : 'Necesita Apoyo'}
                </p>
            </div>
            
            <div className="card rendimiento-reciente">
                <h3>Rendimiento Reciente</h3>
                <div className="rendimiento-simple">
                <div>
                    <p>Fortaleza</p>
                    <span>{rendimientoReciente.fortaleza}</span>
                </div>
                <div>
                    <p>A mejorar</p>
                    <span>{rendimientoReciente.debilidad}</span>
                </div>
                </div>
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default Seguimientos;
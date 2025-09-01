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
import CircularProgressBar from '../../components/CircularProgressBar';
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

/* ========= NUEVO: normalización de nombres para que coincidan con las fotos ========= */
const NOMBRES_EJERCICIOS: { [key: string]: string } = {
  'escala 2': 'Copia de Figuras',
  'copia de figuras': 'Copia de Figuras',
  'trazado guiado': 'Trazado Guiado',
  'seleccion guiada': 'Selección Guiada',
  'selección guiada': 'Selección Guiada',
  'conexiones': 'Conexiones',
  'seguir laberinto': 'Seguir Laberinto',
  'toque secuencial': 'Toque Secuencial',
};

/* ========= NUEVO: import de fotos y mapa Título → Foto ========= */
import imgConexiones from '../../assets/ejercicios/conexiones.png';
import imgCopiaFiguras from '../../assets/ejercicios/copia-figuras.png';
import imgSeguirLaberinto from '../../assets/ejercicios/seguir-laberinto.png';
import imgSeleccionGuiada from '../../assets/ejercicios/seleccion-guiada.png';
import imgToqueSecuencial from '../../assets/ejercicios/toque-secuencial.png';
import imgTrazadoGuiado from '../../assets/ejercicios/trazado-guiado.png';

const FOTO_BY_TIPO: Record<string, string> = {
  'Copia de Figuras': imgCopiaFiguras,
  'Trazado Guiado': imgTrazadoGuiado,
  'Selección Guiada': imgSeleccionGuiada,
  'Conexiones': imgConexiones,
  'Seguir Laberinto': imgSeguirLaberinto,
  'Toque Secuencial': imgToqueSecuencial,
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

    // Agrupar evaluaciones por fecha y calcular promedio diario
    const evaluacionesPorFecha: { [fecha: string]: number[] } = {};
    
    evsPaciente.forEach(ev => {
      const fechaStr = new Date(ev.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' });
      if (!evaluacionesPorFecha[fechaStr]) {
        evaluacionesPorFecha[fechaStr] = [];
      }
      evaluacionesPorFecha[fechaStr].push(ev.puntaje);
    });

    // Crear arrays para labels y datos con promedio por día
    const fechasUnicas = Object.keys(evaluacionesPorFecha).sort((a, b) => {
      return new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime();
    });
    
    const promediosPorDia = fechasUnicas.map(fecha => {
      const puntajes = evaluacionesPorFecha[fecha];
      return Math.round(puntajes.reduce((sum, puntaje) => sum + puntaje, 0) / puntajes.length);
    });

    setProgresoData({
      labels: fechasUnicas,
      datasets: [{
        label: 'Promedio Diario (%)',
        data: promediosPorDia,
        borderColor: '#E30613',
        backgroundColor: 'rgba(227, 6, 19, 0.2)',
        fill: true,
        tension: 0.2
      }]
    });

    const ejercicios: { [key: string]: number[] } = {};
    evsPaciente.forEach(ev => {
      const key = String(ev.tipo_escala || '').toLowerCase();
      const tipo = NOMBRES_EJERCICIOS[key] || (ev.tipo_escala || 'Desconocido');
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
              <div className="op-head">
                <h3>Objetivos del Plan</h3>
                <span className="op-badge">Seguimiento activo</span>
              </div>

              <div className="op-grid">
                <div className="op-box op-corto">
                  <div className="op-icon" aria-hidden>📝</div>
                  <div className="op-content">
                    <div className="op-label">Corto Plazo</div>
                    <div className="op-text">{objetivoCorto || 'Sin plan asignado'}</div>
                  </div>
                </div>

                <div className="op-box op-largo">
                  <div className="op-icon" aria-hidden>🎯</div>
                  <div className="op-content">
                    <div className="op-label">Largo Plazo</div>
                    <div className="op-text">{objetivoLargo || 'Sin plan asignado'}</div>
                  </div>
                </div>
              </div>

              {/* Estado vacío elegante por si no hay plan */}
              {(objetivoCorto === 'Sin plan asignado' && objetivoLargo === 'Sin plan asignado') && (
                <div className="op-empty">Aún no hay un plan de tratamiento asignado.</div>
              )}
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
                    <p className="muted">Fortaleza</p>
                    <span className="badge success">{rendimientoReciente.fortaleza}</span>
                    {FOTO_BY_TIPO[rendimientoReciente.fortaleza] && (
                      <div className="rr-foto">
                        <img
                          className="rr-thumb"
                          src={FOTO_BY_TIPO[rendimientoReciente.fortaleza]}
                          alt={rendimientoReciente.fortaleza}
                          loading="lazy"
                        />
                        <div className="rr-caption">{rendimientoReciente.fortaleza}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="muted">A mejorar</p>
                    <span className="badge warn">{rendimientoReciente.debilidad}</span>
                    {FOTO_BY_TIPO[rendimientoReciente.debilidad] && (
                      <div className="rr-foto">
                        <img
                          className="rr-thumb"
                          src={FOTO_BY_TIPO[rendimientoReciente.debilidad]}
                          alt={rendimientoReciente.debilidad}
                          loading="lazy"
                        />
                        <div className="rr-caption">{rendimientoReciente.debilidad}</div>
                      </div>
                    )}
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

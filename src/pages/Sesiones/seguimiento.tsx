import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './seguimiento.css';
import figura from '../../assets/ejercicios/copia-figuras.png';
import laberinto from '../../assets/ejercicios/seguir-laberinto.png';
import type { Paciente } from '../../models/Paciente';
import type { SeguimientoProgreso } from '../../models/SeguimientoProgreso';
import type { PlanTratamiento } from '../../models/PlanTratamiento';
import { BASE_URL } from '../../config';
import Select from 'react-select';
import { getPacientes } from '../../services/pacienteService';


const aciertosEjercicio = [
  { nombre: 'Trazado Guiado', porcentaje: 75 },
  { nombre: 'Seguir Laberinto', porcentaje: 84 },
  { nombre: 'Toque Secuencial', porcentaje: 73 },
  { nombre: 'Copia de Figuras', porcentaje: 40 },
];

const progresoTratamiento = [
  { nombre: 'Motricidad fina', porcentaje: 99 },
  { nombre: 'Estimulación sensorial', porcentaje: 88 },
  { nombre: 'Grafomotricidad', porcentaje: 75 },
  { nombre: 'Visomotora', porcentaje: 84 },
];

const Seguimientos: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [seguimientos, setSeguimientos] = useState<SeguimientoProgreso[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [nombrePaciente, setNombrePaciente] = useState<string>('');
  const [aciertoTotal, setAciertoTotal] = useState<number>(75);
  const [objetivoCorto, setObjetivoCorto] = useState<string>('');
  const [objetivoLargo, setObjetivoLargo] = useState<string>('');

  useEffect(() => {
    const fetchPacientes = async () => {
      {/*hacer pa too OK*/}
      const rest = await getPacientes()
      setPacientes(rest)
    };
    fetchPacientes();
  }, []);

  const handleBuscar = async () => {
    try {
      const idExtraido = pacienteSeleccionado.split('|')[1]?.trim();
      const id = idExtraido ? parseInt(idExtraido) : null;

      const token = sessionStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/seguimientos/listarseguimientos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: SeguimientoProgreso[] = await res.json();

      const filtrado = data.filter((s) => {
        const coincidePaciente = id ? s.id_paciente === id : true;
        const coincideFecha = (!fechaDesde || s.fecha >= fechaDesde) && (!fechaHasta || s.fecha <= fechaHasta);
        return coincidePaciente && coincideFecha;
      });

      setSeguimientos(filtrado);

      const pac = pacientes.find((p) => p.id_paciente === id);
      if (pac) {
        setNombrePaciente(`${pac.nombre} ${pac.apellido}`);
      }

      const resPlanes = await fetch(`${BASE_URL}/api/planes/listarplanes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const planes = await resPlanes.json();
      const planesPaciente = planes.filter((p) => p.id_paciente === id);
      const planReciente = planesPaciente.sort(
        (a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
      )[0];

      if (planReciente) {
        setObjetivoCorto(planReciente.objetivo_cortoplazo);
        setObjetivoLargo(planReciente.objetivo_largoplazo);
      } else {
        setObjetivoCorto('No hay objetivo definido');
        setObjetivoLargo('No hay objetivo definido');
      }

      const promedio = filtrado.length
        ? Math.round(filtrado.reduce((acc, s) => acc + s.nivel_logro, 0) / filtrado.length)
        : 0;
      setAciertoTotal(promedio);
    } catch (error) {
      console.error('Error al filtrar seguimientos:', error);
    }
  };
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
                  value: p.id_paciente,
                  label: `${p.nombre} ${p.apellido}`,
                }))}
                onChange={(opcion) => {
                  if (opcion) {
                    setPacienteSeleccionado(String(opcion.value));
                    const pac = pacientes.find((p) => p.id_paciente === opcion.value);
                    if (pac) setNombrePaciente(`${pac.nombre} ${pac.apellido}`);
                  } else {
                    setPacienteSeleccionado('');
                    setNombrePaciente('');
                  }
                }}
                placeholder="Buscar paciente..."
                isClearable
              />
              <label>Desde:</label>
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
              <label>Hasta:</label>
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
              <button className="btn-buscar" onClick={handleBuscar}>Buscar</button>
            </div>
          </div>
        </div>

        <div className="grid-dashboard">
          <div className="card ficha-paciente">
            <div className="inicial-circulo">{nombrePaciente.charAt(0)}</div>
            <h3>{nombrePaciente}</h3>
            <p>Diagnóstico visible tras conexión real</p>
            <p>Nivel de Autonomía</p>
            <div className="autonomia moderado">Moderado</div>
          </div>

          <div className="card linea">
            <h3>Progreso del Paciente</h3>
            <div className="grafico-lineas">[Gráfico dinámico aquí]</div>
            <div className="leyenda">
              <span className="leyenda-azul">Motricidad</span>
              <span className="leyenda-rojo">Lenguaje</span>
              <span className="leyenda-naranjo">Coordinación visomotora</span>
            </div>
          </div>

          <div className="card barras-ejercicio">
            <h3>Porcentaje de acierto por ejercicio</h3>
            <ul>
              {aciertosEjercicio.map((ej, i) => (
                <li key={i}>
                  <span>{ej.nombre}</span>
                  <div
                    className={`barra barra-${ej.porcentaje} ${
                      ej.porcentaje < 60 ? 'rojo' : ej.porcentaje < 85 ? 'naranja' : ''
                    }`}
                    style={{ width: `${ej.porcentaje}%` }}
                  >
                    {ej.porcentaje}%
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card objetivos-plan">
            <h3>Objetivos del Plan</h3>
            <p><strong>Corto Plazo:</strong> {objetivoCorto}</p>
            <p><strong>Largo Plazo:</strong> {objetivoLargo}</p>
          </div>

          <div className="card circulo-total">
            <h3>Porcentaje de acierto total</h3>
            <div
              className="circulo"
              style={{ background: `conic-gradient(var(--color-verde) ${aciertoTotal}%, #ccc 0)` }}
            >
              {aciertoTotal}%
            </div>
            <p className="leyenda-circulo">+60%: bien • -60%: alerta</p>
          </div>

          <div className="card rendimiento-reciente">
            <h3>Rendimiento Reciente</h3>
            <div className="rendimiento-simple">
              <div>
                <p>Fortalezas</p>
                <img src={laberinto} alt="fortaleza" />
                <span>Seguir Laberinto</span>
              </div>
              <div>
                <p>Dificultades</p>
                <img src={figura} alt="dificultad" />
                <span>Copia de Figuras</span>
              </div>
            </div>
          </div>

          <div className="card progreso-barras">
            <h3>Progreso del Tratamiento</h3>
            <ul>
              {progresoTratamiento.map((item, i) => (
                <li key={i}>
                  <span>{item.nombre}</span>
                  <div
                    className={`barra barra-${item.porcentaje} ${
                      item.porcentaje < 60 ? 'rojo' : item.porcentaje < 85 ? 'naranja' : ''
                    }`}
                    style={{ width: `${item.porcentaje}%` }}
                  >
                    {item.porcentaje}%
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>

  );
};

export default Seguimientos;

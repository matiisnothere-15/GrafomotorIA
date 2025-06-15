import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import './PlanTratamiento.css';

const PlanTratamientoPage: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoLectura, setModoLectura] = useState(false);
  const [tituloModal, setTituloModal] = useState('Nuevo Plan de Tratamiento');

  const [planes, setPlanes] = useState<any[]>([]);
  const [filtroPaciente, setFiltroPaciente] = useState('todos');

  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: '',
    paciente: '',
    edad: '',
    rut: '',
    patologia: '',
    fecha_inicio: '',
    fecha_fin: '',
    periodicidad: '',
    objetivo_cortoplazo: '',
    objetivo_largoplazo: ''
  });

  const cargarPlanes = async () => {
    const data = [
      {
        id_plan: 1,
        paciente: 'Juana Díaz',
        nombre: 'Plan Rehabilitación',
        edad: 8,
        rut: '21.398.234-0',
        patologia: 'Dificultad motora fina',
        fecha_inicio: '2025-05-10',
        fecha_fin: '2025-08-10',
        estado: 'En Tratamiento'
      },
      {
        id_plan: 2,
        paciente: 'Esteban Peral',
        nombre: 'Estimulación Motora I',
        edad: 10,
        rut: '19.123.710-5',
        patologia: 'Trastorno del desarrollo',
        fecha_inicio: '2025-04-01',
        fecha_fin: '2025-07-01',
        estado: 'En Evaluación'
      },
      {
        id_plan: 3,
        paciente: 'Lucía Gutiérrez',
        nombre: 'Terapia Coordinación',
        edad: 7,
        rut: '21.234.412-8',
        patologia: 'Retraso en desarrollo',
        fecha_inicio: '2025-05-15',
        fecha_fin: '2025-08-15',
        estado: 'En Tratamiento'
      },
      {
        id_plan: 4,
        paciente: 'Sofía Valencia',
        nombre: 'Estimulación Temprana',
        edad: 5,
        rut: '23.049.324-K',
        patologia: 'Trastorno del lenguaje',
        fecha_inicio: '2025-06-01',
        fecha_fin: '2025-09-01',
        estado: 'En Evaluación'
      }
    ];
    setPlanes(data);
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoPlan({ ...nuevoPlan, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    alert('Plan guardado con éxito (mock).');
    setMostrarModal(false);
    cargarPlanes();
  };

  const verPlan = (paciente: string) => {
    const plan = planes.find(p => p.paciente === paciente);
    if (plan) {
      setNuevoPlan({
        nombre: plan.nombre,
        paciente: plan.paciente,
        edad: plan.edad.toString(),
        rut: plan.rut,
        patologia: plan.patologia,
        fecha_inicio: plan.fecha_inicio,
        fecha_fin: plan.fecha_fin,
        periodicidad: 'Cada 2 semanas',
        objetivo_cortoplazo: 'Mejorar coordinación motora fina',
        objetivo_largoplazo: 'Alcanzar independencia funcional en tareas básicas'
      });
      setTituloModal('Plan de Tratamiento');
      setModoLectura(true);
      setMostrarModal(true);
    }
  };

  const editarPlan = (paciente: string) => {
    const plan = planes.find(p => p.paciente === paciente);
    if (plan) {
      setNuevoPlan({
        nombre: plan.nombre,
        paciente: plan.paciente,
        edad: plan.edad.toString(),
        rut: plan.rut,
        patologia: plan.patologia,
        fecha_inicio: plan.fecha_inicio,
        fecha_fin: plan.fecha_fin,
        periodicidad: 'Cada 2 semanas',
        objetivo_cortoplazo: 'Mejorar coordinación motora fina',
        objetivo_largoplazo: 'Alcanzar independencia funcional en tareas básicas'
      });
      setTituloModal('Editar Plan de Tratamiento');
      setModoLectura(false);
      setMostrarModal(true);
    }
  };

  const planesFiltrados = planes.filter(
    p => filtroPaciente === 'todos' || p.paciente === filtroPaciente
  );

  const pacientesUnicos = Array.from(new Set(planes.map(p => p.paciente)));

  return (
    <div className="plan-wrapper">
      <Header />
      <main className="plan-content white-panel">
        <h2 className="titulo-plan">Planes de Tratamiento</h2>

        <div className="filtro-container">
          <select
            className="filtro-paciente"
            value={filtroPaciente}
            onChange={e => setFiltroPaciente(e.target.value)}
          >
            <option value="todos">Todos los pacientes</option>
            {pacientesUnicos.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <table className="plan-tabla">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Nombre del Plan</th>
              <th>Edad</th>
              <th>RUT</th>
              <th>Patología</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {planesFiltrados.map((p, i) => (
              <tr key={i}>
                <td>{p.paciente}</td>
                <td>{p.nombre}</td>
                <td>{p.edad}</td>
                <td>{p.rut}</td>
                <td>{p.patologia}</td>
                <td>{p.fecha_inicio}</td>
                <td>{p.fecha_fin}</td>
                <td>{p.estado}</td>
                <td className="acciones">
                  <button className="btn-icono" title="Ver Plan" onClick={() => verPlan(p.paciente)}>👁️</button>
                  <button className="btn-icono" title="Editar Plan" onClick={() => editarPlan(p.paciente)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="plan-footer">
          <button
            className="btn-nuevo"
            onClick={() => {
              setTituloModal('Nuevo Plan de Tratamiento');
              setModoLectura(false);
              setMostrarModal(true);
              setNuevoPlan({
                nombre: '',
                paciente: '',
                edad: '',
                rut: '',
                patologia: '',
                fecha_inicio: '',
                fecha_fin: '',
                periodicidad: '',
                objetivo_cortoplazo: '',
                objetivo_largoplazo: ''
              });
            }}
          >
            + Nuevo Tratamiento
          </button>
        </div>

        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h3>{tituloModal}</h3>
              <input name="paciente"placeholder="Nombre del paciente"value={nuevoPlan.paciente}onChange={handleChange}readOnly={modoLectura}/>
              <input name="nombre" placeholder="Nombre del plan" value={nuevoPlan.nombre} onChange={handleChange} readOnly={modoLectura} />
              <input name="edad" type="number" placeholder="Edad" value={nuevoPlan.edad} onChange={handleChange} readOnly={modoLectura} />
              <input name="rut" placeholder="RUT" value={nuevoPlan.rut} onChange={handleChange} readOnly={modoLectura} />
              <input name="patologia" placeholder="Patología" value={nuevoPlan.patologia} onChange={handleChange} readOnly={modoLectura} />
              <input name="fecha_inicio" type="date" value={nuevoPlan.fecha_inicio} onChange={handleChange} readOnly={modoLectura} />
              <input name="fecha_fin" type="date" value={nuevoPlan.fecha_fin} onChange={handleChange} readOnly={modoLectura} />
              <input name="periodicidad" placeholder="Periodicidad" value={nuevoPlan.periodicidad} onChange={handleChange} readOnly={modoLectura} />
              <textarea name="objetivo_cortoplazo" placeholder="Objetivo a corto plazo" value={nuevoPlan.objetivo_cortoplazo} onChange={handleChange} readOnly={modoLectura} />
              <textarea name="objetivo_largoplazo" placeholder="Objetivo a largo plazo" value={nuevoPlan.objetivo_largoplazo} onChange={handleChange} readOnly={modoLectura} />

              {modoLectura ? (
                <div className="modal-acciones">
                  <button onClick={() => setMostrarModal(false)}>Cerrar</button>
                </div>
              ) : (
                <div className="modal-acciones">
                  <button onClick={handleGuardar}>Guardar</button>
                  <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlanTratamientoPage;

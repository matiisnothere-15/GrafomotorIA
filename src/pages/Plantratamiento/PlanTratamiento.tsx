import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './PlanTratamiento.css';
import { obtenerPlanesTratamiento, crearPlanTratamiento } from '../../services/planTratamientoService';
import type { PlanTratamiento } from '../../models/PlanTratamiento';


const PlanTratamientoPage: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoLectura, setModoLectura] = useState(false);
  const [tituloModal, setTituloModal] = useState('Nuevo Plan de Tratamiento');

  const [planes, setPlanes] = useState<any[]>([]);
  const [filtroPaciente, setFiltroPaciente] = useState('todos');

  const [nuevoPlan, setNuevoPlan] = useState({
    paciente: '',
    nombre_paciente: '',
    nombre: '',
    edad: '',
    rut: '',
    patologia: '',
    fecha_inicio: '',
    fecha_fin: '',
    periodicidad: '',
    objetivo_cortoplazo: '',
    objetivo_largoplazo: ''
  });


  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const cargarPlanes = async () => {
    try {
      const data = await obtenerPlanesTratamiento();
      const transformado = data.map((p: any) => ({
        id_plan: p.id_plan,
        paciente: `${p.nombre} ${p.apellido}`,
        id_paciente: p.id_paciente,
        nombre: "Plan Terapéutico",
        edad: calcularEdad(p.fecha_nacimiento),
        rut: p.rut,
        patologia: p.diagnostico,
        fecha_inicio: p.fecha_inicio,
        fecha_fin: p.fecha_fin,
        periodicidad: p.periodicidad,
        objetivo_cortoplazo: p.objetivo_cortoplazo,
        objetivo_largoplazo: p.objetivo_largoplazo,
        estado: "En Tratamiento"
      }));

      setPlanes(transformado);
    } catch (error) {
      console.error("Error al cargar los planes:", error);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNuevoPlan({ ...nuevoPlan, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const planReal: PlanTratamiento = {
        fecha_inicio: nuevoPlan.fecha_inicio,
        fecha_fin: nuevoPlan.fecha_fin,
        objetivo_cortoplazo: nuevoPlan.objetivo_cortoplazo,
        objetivo_largoplazo: nuevoPlan.objetivo_largoplazo,
        periodicidad: nuevoPlan.periodicidad,
        id_paciente: parseInt(nuevoPlan.paciente),
        id_usuario: parseInt(sessionStorage.getItem("id_usuario") || "0")
      };


      await crearPlanTratamiento(planReal);
      alert('✅ Plan guardado con éxito.');
      setMostrarModal(false);
      cargarPlanes();
    } catch (error) {
      alert('❌ No se pudo guardar el plan.');
      console.error(error);
    }
  };

  const verPlan = (pacienteNombre: string) => {
    const plan = planes.find(p => p.paciente === pacienteNombre);
    if (plan) {
      setNuevoPlan({
        nombre: plan.nombre,
        paciente: plan.id_paciente.toString(),
        nombre_paciente: plan.paciente,
        edad: plan.edad.toString(),
        rut: plan.rut,
        patologia: plan.patologia,
        fecha_inicio: plan.fecha_inicio,
        fecha_fin: plan.fecha_fin,
        periodicidad: plan.periodicidad || 'Cada 2 semanas',
        objetivo_cortoplazo: plan.objetivo_cortoplazo || '',
        objetivo_largoplazo: plan.objetivo_largoplazo || ''
      });
      setTituloModal('Plan de Tratamiento');
      setModoLectura(true);
      setMostrarModal(true);
    }
  };

  const editarPlan = (pacienteNombre: string) => {
    const plan = planes.find(p => p.paciente === pacienteNombre);
    if (plan) {
      setNuevoPlan({
        nombre: plan.nombre,
        paciente: plan.id_paciente.toString(),
        nombre_paciente: plan.paciente,
        edad: plan.edad.toString(),
        rut: plan.rut,
        patologia: plan.patologia,
        fecha_inicio: plan.fecha_inicio,
        fecha_fin: plan.fecha_fin,
        periodicidad: plan.periodicidad || '',
        objetivo_cortoplazo: plan.objetivo_cortoplazo || '',
        objetivo_largoplazo: plan.objetivo_largoplazo || ''
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
                nombre_paciente: '',
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

            <div className="campo">
              <label>Nombre del paciente</label>
              <input name="nombre_paciente" value={nuevoPlan.nombre_paciente} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Nombre del plan</label>
              <input name="nombre" value={nuevoPlan.nombre} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Edad</label>
              <input name="edad" type="number" value={nuevoPlan.edad} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>RUT</label>
              <input name="rut" value={nuevoPlan.rut} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Patología</label>
              <input name="patologia" value={nuevoPlan.patologia} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Fecha inicio</label>
              <input name="fecha_inicio" type="date" value={nuevoPlan.fecha_inicio} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Fecha fin</label>
              <input name="fecha_fin" type="date" value={nuevoPlan.fecha_fin} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Periodicidad</label>
              <input name="periodicidad" value={nuevoPlan.periodicidad} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Objetivo a corto plazo</label>
              <textarea name="objetivo_cortoplazo" value={nuevoPlan.objetivo_cortoplazo} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="campo">
              <label>Objetivo a largo plazo</label>
              <textarea name="objetivo_largoplazo" value={nuevoPlan.objetivo_largoplazo} onChange={handleChange} readOnly={modoLectura} />
            </div>

            <div className="modal-acciones">
              {modoLectura ? (
                <button onClick={() => setMostrarModal(false)}>Cerrar</button>
              ) : (
                <>
                  <button onClick={handleGuardar}>Guardar</button>
                  <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
};

export default PlanTratamientoPage;

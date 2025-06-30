import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './PlanTratamiento.css';
import { obtenerPlanesTratamiento, crearPlanTratamiento, actualizarPlanTratamiento } from '../../services/planTratamientoService';
import { obtenerPacientes, actualizarPaciente } from '../../services/pacienteService';
import type { PlanTratamiento } from '../../models/PlanTratamiento';

const PlanTratamientoPage: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoLectura, setModoLectura] = useState(false);
  const [tituloModal, setTituloModal] = useState('Nuevo Plan de Tratamiento');
  const [planes, setPlanes] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [filtroPaciente, setFiltroPaciente] = useState('todos');

  const [nuevoPlan, setNuevoPlan] = useState({
    id_plan: null,
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
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const calcularFechaNacimientoDesdeEdad = (edad: number) => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - edad);
    return hoy.toISOString().split('T')[0];
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
        estado: "En Tratamiento",
        fecha_nacimiento: p.fecha_nacimiento
      }));
      setPlanes(transformado);
    } catch (error) {
      console.error("Error al cargar los planes:", error);
    }
  };

  const cargarPacientes = async () => {
    try {
      const data = await obtenerPacientes();
      setPacientes(data);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    }
  };

  useEffect(() => {
    cargarPlanes();
    cargarPacientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNuevoPlan({ ...nuevoPlan, [e.target.name]: e.target.value });
  };

  const handleSeleccionPaciente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seleccionado = pacientes.find(p => p.id_paciente.toString() === e.target.value);
    if (seleccionado) {
      setNuevoPlan(prev => ({
        ...prev,
        paciente: seleccionado.id_paciente.toString(),
        nombre_paciente: `${seleccionado.nombre} ${seleccionado.apellido}`,
        edad: calcularEdad(seleccionado.fecha_nacimiento).toString(),
        rut: seleccionado.rut,
        patologia: seleccionado.diagnostico
      }));
    } else {
      setNuevoPlan(prev => ({ ...prev, paciente: '', nombre_paciente: '', edad: '', rut: '', patologia: '' }));
    }
  };

  const handleGuardar = async () => {
    const errores: string[] = [];

    const fechaInicio = new Date(nuevoPlan.fecha_inicio);
    const fechaFin = new Date(nuevoPlan.fecha_fin);

    if (!nuevoPlan.paciente) errores.push("Debe seleccionar un paciente.");
    if (!nuevoPlan.nombre) errores.push("Debe ingresar el nombre del plan.");
    if (!/^\d+$/.test(nuevoPlan.edad) || parseInt(nuevoPlan.edad) <= 0)
      errores.push("Edad inválida.");
    if (!/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/.test(nuevoPlan.rut))
      errores.push("RUT inválido.");
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nuevoPlan.patologia))
      errores.push("Patología inválida.");
    if (!nuevoPlan.fecha_inicio) errores.push("Debe ingresar fecha de inicio.");
    if (!nuevoPlan.fecha_fin) errores.push("Debe ingresar fecha de fin.");
    if (fechaFin < fechaInicio) errores.push("La fecha de fin no puede ser anterior a la fecha de inicio.");
    if (!nuevoPlan.periodicidad) errores.push("Debe ingresar periodicidad.");
    if (!nuevoPlan.objetivo_cortoplazo) errores.push("Ingrese objetivo corto plazo.");
    if (!nuevoPlan.objetivo_largoplazo) errores.push("Ingrese objetivo largo plazo.");

    if (errores.length > 0) {
      alert("Errores:\n\n" + errores.join("\n"));
      return;
    }

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

      const pacienteData = {
        nombre: nuevoPlan.nombre_paciente.split(' ')[0],
        apellido: nuevoPlan.nombre_paciente.split(' ').slice(1).join(' '),
        fecha_nacimiento: calcularFechaNacimientoDesdeEdad(parseInt(nuevoPlan.edad)),
        rut: nuevoPlan.rut,
        diagnostico: nuevoPlan.patologia
      };

      if (nuevoPlan.id_plan !== null) {
        await actualizarPlanTratamiento(nuevoPlan.id_plan, planReal);
        await actualizarPaciente(parseInt(nuevoPlan.paciente), pacienteData);
        alert('✏️ Plan actualizado con éxito.');
      } else {
        await crearPlanTratamiento(planReal);
        alert('✅ Plan creado con éxito.');
      }

      setMostrarModal(false);
      cargarPlanes();
    } catch (error) {
      alert('❌ No se pudo guardar el plan.');
      console.error(error);
    }
  };



  const editarPlan = (id_plan: number) => {
    const plan = planes.find(p => p.id_plan === id_plan);
    if (plan) {
      setNuevoPlan({
        id_plan: plan.id_plan,
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
                  <button className="btn-icono" title="Ver Plan" onClick={() => editarPlan(p.id_plan)}>👁️</button>
                  <button className="btn-icono" title="Editar Plan" onClick={() => editarPlan(p.id_plan)}>✏️</button>
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
                id_plan: null,
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
                <label>Paciente</label>
                <select name="paciente" value={nuevoPlan.paciente} onChange={handleSeleccionPaciente} disabled={modoLectura} className="input">
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map((p, i) => (
                    <option key={i} value={p.id_paciente}>{p.nombre} {p.apellido}</option>
                  ))}
                </select>
              </div>

              <div className="campo"><label>Nombre del paciente</label><input name="nombre_paciente" value={nuevoPlan.nombre_paciente} onChange={handleChange} readOnly /></div>
              <div className="campo"><label>Nombre del plan</label><input name="nombre" value={nuevoPlan.nombre} onChange={handleChange} readOnly={modoLectura} /></div>
              <div className="campo"><label>Edad</label><input name="edad" type="number" value={nuevoPlan.edad} onChange={handleChange} readOnly /></div>
              <div className="campo"><label>RUT</label><input name="rut" value={nuevoPlan.rut} onChange={handleChange} readOnly /></div>
              <div className="campo"><label>Patología</label><input name="patologia" value={nuevoPlan.patologia} onChange={handleChange} readOnly /></div>
              <div className="campo"><label>Fecha inicio</label><input name="fecha_fin" type="date" value={nuevoPlan.fecha_fin}min={nuevoPlan.fecha_inicio || undefined}onChange={handleChange}readOnly={modoLectura}/></div>
              <div className="campo"><label>Fecha fin</label><input name="fecha_fin" type="date" value={nuevoPlan.fecha_fin} onChange={handleChange} readOnly={modoLectura} /></div>
              <div className="campo"><label>Periodicidad</label><input name="periodicidad" value={nuevoPlan.periodicidad} onChange={handleChange} readOnly={modoLectura} /></div>
              <div className="campo"><label>Objetivo a corto plazo</label><textarea name="objetivo_cortoplazo" value={nuevoPlan.objetivo_cortoplazo} onChange={handleChange} readOnly={modoLectura} /></div>
              <div className="campo"><label>Objetivo a largo plazo</label><textarea name="objetivo_largoplazo" value={nuevoPlan.objetivo_largoplazo} onChange={handleChange} readOnly={modoLectura} /></div>

              <div className="modal-acciones">
                {modoLectura ? (
                  <button onClick={() => setMostrarModal(false)}>Cerrar</button>
                ) : (
                  <>
                    <button type="button" onClick={handleGuardar}>Guardar</button>
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

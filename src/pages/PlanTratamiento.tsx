import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import './PlanTratamiento.css';

const PlanTratamientoPage: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
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
        nombre: 'Terapia Coordinación Motora',
        edad: 7,
        rut: '21.234.412-8',
        patologia: 'Retraso en desarrollo psicomotor',
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

  const planesFiltrados = planes.filter(
    p => filtroPaciente === 'todos' || p.paciente === filtroPaciente
  );

  const pacientesUnicos = Array.from(new Set(planes.map(p => p.paciente)));

  return (
    <div className="plan-wrapper">
        
        <Header />
      <main className="plan-content">
        <h2>Planes de Tratamiento</h2>

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
                <td>
                  <button className="btn-nuevo" onClick={() => alert(`Gestionar plan ID ${p.id_plan}`)}>
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="plan-footer">
          <button className="btn-nuevo" onClick={() => setMostrarModal(true)}>
            + Nuevo Tratamiento
          </button>
        </div>

        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h3>Nuevo Plan de Tratamiento</h3>
              <input name="paciente" placeholder="Nombre del paciente" onChange={handleChange} />
              <input name="nombre" placeholder="Nombre del plan" onChange={handleChange} />
              <input name="edad" type="number" placeholder="Edad" onChange={handleChange} />
              <input name="rut" placeholder="RUT" onChange={handleChange} />
              <input name="patologia" placeholder="Patología" onChange={handleChange} />
              <input name="fecha_inicio" type="date" onChange={handleChange} />
              <input name="fecha_fin" type="date" onChange={handleChange} />
              <input name="periodicidad" placeholder="Periodicidad" onChange={handleChange} />
              <textarea name="objetivo_cortoplazo" placeholder="Objetivo a corto plazo" onChange={handleChange} />
              <textarea name="objetivo_largoplazo" placeholder="Objetivo a largo plazo" onChange={handleChange} />
              <div className="modal-acciones">
                <button onClick={handleGuardar}>Guardar</button>
                <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlanTratamientoPage;

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import './PlanTratamiento.css';
import { crearPlanTratamiento, obtenerPlanesTratamiento } from '../services/planTratamientoService';

const PlanTratamientoPage: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [nuevoPlan, setNuevoPlan] = useState({
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

  const cargarPlanes = async () => {
    try {
      const data = await obtenerPlanesTratamiento();
      setPlanes(data);
    } catch (error) {
      alert('Error al cargar los planes: ' + error);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoPlan({ ...nuevoPlan, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await crearPlanTratamiento({
        ...nuevoPlan,
        edad: Number(nuevoPlan.edad)
      });
      alert("Plan guardado con éxito.");
      setMostrarModal(false);
      cargarPlanes();
    } catch (error) {
      alert("Error al guardar: " + error);
    }
  };

  return (
    <div className="plan-wrapper">
      <Header />
      <main className="plan-content">
        <h2>Planes de Tratamiento</h2>

        <div className="acciones-superiores">
          <button className="btn-nuevo" onClick={() => setMostrarModal(true)}>+ Nuevo Tratamiento</button>
        </div>

        <table className="plan-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>RUT</th>
              <th>Patología</th>
              <th>Fecha de Cita</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((p: any, i: number) => (
              <tr key={i}>
                <td>{p.nombre}</td>
                <td>{p.edad}</td>
                <td>{p.rut}</td>
                <td>{p.patologia}</td>
                <td>{p.fecha_inicio}</td>
                <td>{p.fecha_fin}</td>
                <td>{p.estado || 'Pendiente'}</td>
                <td>
                  <button className="btn-nuevo" onClick={() => alert(`Gestionar plan ID ${p.id_plan}`)}>
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <div className="modal">
            <div className="modal-contenido">
              <h3>Nuevo Plan de Tratamiento</h3>

              <input name="nombre" placeholder="Nombre del paciente" onChange={handleChange} />
              <input name="edad" type="number" placeholder="Edad" onChange={handleChange} />
              <input name="rut" placeholder="RUT" onChange={handleChange} />
              <input name="patologia" placeholder="Patología" onChange={handleChange} />
              <input name="fecha_inicio" type="date" placeholder="Fecha de inicio" onChange={handleChange} />
              <input name="fecha_fin" type="date" placeholder="Fecha de término" onChange={handleChange} />
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

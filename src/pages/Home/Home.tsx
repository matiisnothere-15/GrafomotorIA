import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import '../Auth/Login.css';
import './Home.css';
import Header from '../../components/Header'; 
import {
  FaCalendarAlt,
  FaDumbbell,
  FaClipboardList,
  FaTasks,
  FaChartLine,
  FaInfoCircle,
  FaUserMd,
  FaUser
} from 'react-icons/fa';
import type { Paciente } from '../../models/Paciente';
import { useGlobalPaciente } from '../../context/PacienteContext';
import { obtenerPacientes, obtenerPacientesPorTerapeuta } from '../../services/pacienteService';

const opcionesPaciente = [
  { icono: <FaDumbbell />, texto: 'Biblioteca de ejercicios', ruta: '/actividades' }
];

const opcionesTerapeuta = [
  { icono: <FaClipboardList />, texto: 'Sesiones', ruta: '/Sesion' },
  { icono: <FaCalendarAlt />, texto: 'Calendario y citas', ruta: '/Calendario' },
  { icono: <FaTasks />, texto: 'Planes de tratamiento', ruta: '/PlanTratamiento' },
  { icono: <FaChartLine />, texto: 'Seguimiento y progresos', ruta: '/Seguimientos' }
  // { icono: <FaInfoCircle />, texto: 'Contactanos', ruta: '/contactanos' }
];

const Home: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>('');
  const { setGlobalPaciente } = useGlobalPaciente();
  const [nombrePaciente, setNombrePaciente] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [abierto, setAbierto] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    setGlobalPaciente("", "")
    document.title = 'Grafomotor IA | Inicio';
    const cargarPacientes = async () => {
      try {
        if (sessionStorage.getItem('tipo_usuario') == "admin") {
          const [pacientesData] = await Promise.all([obtenerPacientes()]);
          setPacientes(pacientesData);
        } else {
          const id_usuario = Number(sessionStorage.getItem('id_usuario'));
          console.log(id_usuario)
          const [pacientesData] = await Promise.all([obtenerPacientesPorTerapeuta(id_usuario)]);
          setPacientes(pacientesData);
        }
      } catch(e) {
        console.error("Error al cargar los pacientes:", e);
      } finally {
        setIsLoading(false);
      }
    }
    cargarPacientes()
  }, []);

  const seleccionarPaciente = () => {
    setGlobalPaciente(pacienteSeleccionado, nombrePaciente);
    navigate("/actividades");
  }

  return (
    <div className="home-wrapper">
      <Header />
      <main className="home-content">

        {/* Sección Paciente */}
        <div className="categoria-seccion admin-seccion">
          <div className="categoria-header">
            <h2 className="categoria-titulo admin-titulo">
              <FaUser className="categoria-icono" />
              Paciente
            </h2>
          </div>
          <div className="home-grid admin-grid">
            {opcionesPaciente.map((item, index) => (
              item.ruta == "/actividades"
                ?
                <button onClick={() => setAbierto(true)} className="no-border home-card admin-card" key={`paciente-${index}`}>
                  <div className="card-circle admin-circle">{item.icono}</div>
                  <span className="card-texto">{item.texto}</span>
                </button>
                :
                <Link to={item.ruta} className="home-card admin-card" key={`paciente-${index}`}>
                  <div className="card-circle admin-circle">{item.icono}</div>
                  <span className="card-texto">{item.texto}</span>
                </Link>
            ))}
          </div>
        </div>

        {/* Sección Terapeuta */}
        <div className="categoria-seccion terapeuta-seccion">
          <div className="categoria-header">
            <h2 className="categoria-titulo terapeuta-titulo">
              <FaUserMd className="categoria-icono" />
              Terapeuta
            </h2>
          </div>
          <div className="home-grid terapeuta-grid">
            {opcionesTerapeuta.map((item, index) => (

              item.ruta == "/actividades"

                ?

                <button onClick={() => setAbierto(true)} className="no-border home-card terapeuta-card" key={`terapeuta-${index}`}>
                  <div className="card-circle terapeuta-circle">{item.icono}</div>
                  <span className="card-texto">{item.texto}</span>
                </button>

                :

                <Link to={item.ruta} className="home-card terapeuta-card" key={`terapeuta-${index}`}>
                  <div className="card-circle terapeuta-circle">{item.icono}</div>
                  <span className="card-texto">{item.texto}</span>
                </Link>

            ))}
          </div>
        </div>


        {/*Modal de seleccion de paciente*/}
        {
          abierto

          &&

          <div className='modal'>
            <div className='modal-contenido-pacientes'>
              <h3>Selecciona un paciente para continuar</h3>
              <div className="campo">
                <Select
                  className='select-paciente'
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
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  noOptionsMessage={() => "Sin resultados"}
                />
              </div>

              <div className="modal-acciones">
                {
                  pacienteSeleccionado == ""
                  ?
                  <button className='button-disabled' disabled>Iniciar</button>
                  :
                  <button onClick={seleccionarPaciente}>Iniciar</button>
                }
                
                <button onClick={() => {
                  setAbierto(false);
                  setNombrePaciente("");
                  setPacienteSeleccionado("");
                }}>Cerrar</button>
              </div>
            </div>
          </div>
        }

      </main>
    </div>
  );
};

export default Home;
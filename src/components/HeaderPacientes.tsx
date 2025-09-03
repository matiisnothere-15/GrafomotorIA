import { useNavigate } from 'react-router-dom';
import logo from '../assets/teleton-logo.png';
import { FaHospitalUser } from "react-icons/fa6";
import './Header.css';
import { useState } from 'react';
import { useGlobalPaciente } from '../context/PacienteContext';

type Props = {
  nombre_paciente: string;
};

const HeaderPaciente = ({ nombre_paciente }: Props) => {
    const [abierto, setAbierto] = useState(false);
    const navigate = useNavigate();
    const { setGlobalPaciente } = useGlobalPaciente();

    const cerrarSesion = () => {
        setGlobalPaciente("", "")
        sessionStorage.clear();
        localStorage.removeItem("fotoPerfil");
        navigate('/');
    }

    return (
        <header className="login-header">
            <div className="logo">
                <img src={logo} alt="Teletón" className="login-logo" />
                <div className="logo-separador" />
                <p className="nombre-logo">Grafomotor IA</p>

                <button className='boton' onClick={() => setAbierto(true)}>Salir</button>
            </div>

            <div className="user-container">
                <div className="user-label" style={{gap: "15px"}}>
                    <span><strong>Paciente: </strong> {nombre_paciente}</span>
                    
                    <FaHospitalUser style={{width: "32px", height: "32px", color: "#E30613"}}></FaHospitalUser>
                </div>

            </div>

            {
                abierto && (
                    <div className='modal'>
                        <div className='modal-contenido-pacientes'>
                            <h3>¿Seguro que deseas salir?</h3>
                            
                            <p>La sesión de ejercicios finalizará y no podrás volver a iniciarla.</p>

                            <div className="modal-acciones">
                                <button onClick={() => cerrarSesion()}>Salir</button>
                                
                                <button onClick={() => {
                                setAbierto(false);
                                }}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </header>
    );
};

export default HeaderPaciente;
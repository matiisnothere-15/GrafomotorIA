import { useNavigate } from 'react-router-dom';
import logo from '../assets/teleton-logo.png';
import { FaHospitalUser } from "react-icons/fa6";
import './Header.css';
import { useEffect, useState, useRef } from 'react';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  nombre_paciente: string;
};

const HeaderPaciente = ({ nombre_paciente }: Props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const salirSesion = () => {
        navigate('/');
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            };
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return (
        <header className="login-header">
            <div className="logo">
                <img src={logo} alt="Teletón" className="login-logo" />
                <div className="logo-separador" />
                <p className="nombre-logo">Grafomotor IA</p>
            </div>

            <div className="user-container" onClick={() => setMenuOpen(!menuOpen)} ref={dropdownRef}>
                <div className="user-label" style={{gap: "15px"}}>
                    <span><strong>Paciente: </strong> {nombre_paciente}</span>
                    
                    <FaHospitalUser style={{width: "32px", height: "32px", color: "#E30613"}}></FaHospitalUser>
                    <IoIosArrowDown />
                </div>

                {
                    menuOpen && (
                        <div className="user-dropdown-pacientes">
                            <button onClick={() => salirSesion()} className="logout">
                                <RiLogoutBoxLine /> Salir de la sesión
                            </button>
                        </div>
                )}

            </div>

        </header>
    );
};

export default HeaderPaciente;
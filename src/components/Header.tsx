import React, { useState, useRef, useEffect } from 'react'; 
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '../assets/teleton-logo.png';
import { FaUserCircle, FaUser, FaCog } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);

  const ocultarMenuUsuario = ['/', '/recuperar-contrasena', '/restablecer-contrasena'];
  const mostrarUsuario = !ocultarMenuUsuario.includes(location.pathname);

  useEffect(() => {
    const cargarFoto = () => {
    const almacenada = localStorage.getItem('fotoPerfil') || sessionStorage.getItem('imagen');
      setFoto(almacenada);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    cargarFoto();
    window.addEventListener('fotoCambio', cargarFoto);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('fotoCambio', cargarFoto);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("fotoPerfil");
    navigate('/');
  };

  const handleLogoClick = () => {
    if (mostrarUsuario) {
      navigate('/home');
    }
  };

  return (
    <header className="login-header">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Teletón" className="login-logo" />
        <div className="logo-separador" />
        <p className="nombre-logo">Grafomotor IA</p>
      </div>

      {mostrarUsuario && (
        <div className="user-container" ref={dropdownRef}>
          <div className="user-label" onClick={() => setMenuOpen(!menuOpen)}>
            <span>Hola, {sessionStorage.getItem("nombre") || "Usuario"}</span>
            <div className="perfil-link">
              {foto ? (
                <img src={foto} alt="Foto de perfil" className="user-img" />
              ) : (
                <FaUserCircle className="user-icon" />
              )}
            </div>
          </div>
          {menuOpen && (
            <div className="user-dropdown">
              <Link to="/perfil"><FaUser /> Perfil</Link>
              <Link to="/configuracion"><FaCog /> Configuración</Link>
              <button onClick={handleLogout} className="logout">
                <RiLogoutBoxLine /> Salir
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

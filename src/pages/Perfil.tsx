import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { FaUserCircle } from 'react-icons/fa';
import './Login.css';
import './Perfil.css';

const Perfil: React.FC = () => {
  const [foto, setFoto] = useState<string | null>(null);
  const [apodo, setApodo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = 'Grafomotor IA | Perfil';
    const almacenada = localStorage.getItem('fotoPerfil') || sessionStorage.getItem('fotoPerfil');
    if (almacenada) setFoto(almacenada);
    const nick = sessionStorage.getItem('apodo');
    if (nick) setApodo(nick);
    const fecha = sessionStorage.getItem('fecha_nacimiento');
    if (fecha) setFechaNacimiento(fecha);
  }, []);

  const cambiarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultado = reader.result as string;
        setFoto(resultado);
        localStorage.setItem('fotoPerfil', resultado);
        window.dispatchEvent(new Event('fotoCambio'));
      };
      reader.readAsDataURL(archivo);
    }
  };

  const nombre = sessionStorage.getItem('nombre') || '';
  const apellido = sessionStorage.getItem('apellido') || '';
  const tipo = sessionStorage.getItem('tipo_usuario') || '';
  const nick = apodo || sessionStorage.getItem('apodo') || '';
  const fechaNac = fechaNacimiento || sessionStorage.getItem('fecha_nacimiento') || '';
  const rut = sessionStorage.getItem('rut') || '';
  const correo = sessionStorage.getItem('correo_institucional') || '';
  const cargo = sessionStorage.getItem('cargo') || '';
  const especialidad = sessionStorage.getItem('especialidad') || '';
  const fechaIngreso = sessionStorage.getItem('fecha_ingreso') || '';

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const dispararInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="home-wrapper">
      <Header />
      <main className="perfil-page">
        <div className="perfil-card">
          <div className="foto-container" onClick={abrirModal}>
            {foto ? (
              <img src={foto} alt="Foto de perfil" className="foto-perfil" />
            ) : (
              <FaUserCircle className="icono-perfil" />
            )}
          </div>
          <div className="datos-personales">
            <p className="dato"><strong>Nombre completo:</strong> {nombre} {apellido}</p>
            <p className="dato"><strong>RUT:</strong> {rut}</p>
            <p className="dato"><strong>Correo institucional:</strong> {correo}</p>
            <p className="dato"><strong>Cargo:</strong> {cargo}</p>
            <p className="dato"><strong>Especialidad o área:</strong> {especialidad}</p>
            <p className="dato"><strong>Fecha de ingreso:</strong> {fechaIngreso}</p>
            {nick && <p className="dato"><strong>Apodo:</strong> {nick}</p>}
            {fechaNac && <p className="dato"><strong>Fecha de nacimiento:</strong> {fechaNac}</p>}
            {tipo && <p className="dato"><strong>Tipo de usuario:</strong> {tipo}</p>}
          </div>
        </div>
        {mostrarModal && (
          <div className="perfil-modal-overlay" onClick={cerrarModal}>
            <div className="perfil-modal" onClick={e => e.stopPropagation()}>
              {foto ? (
                <img src={foto} alt="Foto de perfil" className="modal-foto" />
              ) : (
                <FaUserCircle className="modal-icon" />
              )}
              <button className="btn-primario" onClick={dispararInput}>Cambiar foto</button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={e => {
                  cambiarFoto(e);
                  cerrarModal();
                }}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Perfil;
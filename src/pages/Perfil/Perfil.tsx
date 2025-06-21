import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import { FaUserCircle } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';
import { actualizarImagenUsuario } from '../../services/usuarioService';
import '../Auth/Login.css';
import './Perfil.css';

const Perfil: React.FC = () => {
  const [foto, setFoto] = useState<string | null>(null);
  const [apodo, setApodo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = 'Grafomotor IA | Perfil';
    const almacenada = localStorage.getItem('fotoPerfil') || sessionStorage.getItem('imagen');
    if (almacenada) setFoto(almacenada);
    const nick = sessionStorage.getItem('apodo');
    if (nick) setApodo(nick);
    const fecha = sessionStorage.getItem('fecha_nacimiento');
    if (fecha) setFechaNacimiento(fecha);
  }, []);

  const cambiarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const archivo = e.target.files?.[0];
  if (!archivo) return;

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;


        const minDim = Math.min(img.width, img.height);
        const offsetX = (img.width - minDim) / 2;
        const offsetY = (img.height - minDim) / 2;

        ctx.drawImage(
          img,
          offsetX, offsetY,          
          minDim, minDim,               
          0, 0,                         
          80, 80                        
        );

        const base64 = canvas.toDataURL('image/jpeg', 0.9); 

        const sizeBytes = (base64.length * 3) / 4;
        if (sizeBytes > 5120) {
          const realKB = (sizeBytes / 1024).toFixed(2);
          alert(`La imagen recortada pesa ${realKB} KB. Debe ser menor a 5 KB.`);
          return;
        }

        setFoto(base64);
        sessionStorage.setItem("imagen", base64);
        localStorage.setItem("fotoPerfil", base64);
        window.dispatchEvent(new Event('fotoCambio'));

        const idUsuario = parseInt(sessionStorage.getItem('id_usuario') || '0');
        console.log("🛰️ ID usuario:", idUsuario);
        console.log("🧠 Imagen base64:", base64.slice(0, 30), "...");

        if (idUsuario) {
          await actualizarImagenUsuario(idUsuario, base64)
            .then((res) => console.log("✅ Imagen guardada en backend:", res))
            .catch((err) => console.error("❌ Error al subir imagen:", err));
        } else {
          console.warn("⚠️ No hay id_usuario en sessionStorage");
        }
      };

      reader.readAsDataURL(archivo);
    } catch (error) {
      console.error("❌ Error al procesar imagen:", error);
      alert("Error al procesar la imagen.");
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
  const dispararInput = () => inputRef.current?.click();

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
                onChange={async e => {
                  await cambiarFoto(e);
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

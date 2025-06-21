import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Contactanos.css';

const Contactanos: React.FC = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });

  const [mostrarModal, setMostrarModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      if (response.ok) {
        setFormulario({ nombre: '', correo: '', mensaje: '' });
        setMostrarModal(true);
      } else {
        alert("Error al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error en la conexión.");
    }
  };


  // Oculta el mensaje automáticamente después de 4 segundos
  useEffect(() => {
    if (mostrarModal) {
      const timer = setTimeout(() => setMostrarModal(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [mostrarModal]);

  return (
    <div className="contacto-wrapper">
      <Header />

      <main className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit}>
          {mostrarModal && (
            <div className="mensaje-confirmacion">
              Tu mensaje ha sido enviado. Te responderemos pronto 😊
            </div>
          )}

          <h1>Contáctanos</h1>
          <p>¿Tienes dudas o sugerencias? Escríbenos y te responderemos pronto.</p>

          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formulario.correo}
            onChange={handleChange}
            required
          />

          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formulario.mensaje}
            onChange={handleChange}
            rows={5}
            required
          />

          <button type="submit">Enviar</button>
        </form>
      </main>
    </div>
  );
};

export default Contactanos;
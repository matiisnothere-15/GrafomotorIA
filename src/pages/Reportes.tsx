// src/pages/Reportes.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import { FaFileAlt, FaEye } from 'react-icons/fa';
import './Reportes.css';

interface Reporte {
  id: number;
  paciente: string;
  rut: string;
  fecha: string;
  informe: string;
  estado: 'En Evaluación' | 'En Tratamiento' | 'Alta Médica' | 'En Seguimiento';
}

const mockReportes: Reporte[] = [
  { id: 1, paciente: 'Juana Díaz',     rut: '21.398.234-0', fecha: '01-04-2025', informe: 'Evaluación inicial',            estado: 'En Evaluación' },
  { id: 2, paciente: 'Esteban Peral',  rut: '19.123.710-5', fecha: '25-03-2025', informe: 'Informe de progreso I',         estado: 'En Tratamiento' },
  { id: 3, paciente: 'Fernanda Alis',  rut: '23.234.321-3', fecha: '12-02-2025', informe: 'Informe Final',                estado: 'Alta Médica'},
  { id: 4, paciente: 'Aitana Aravena', rut: '22.232.094-4', fecha: '09-02-2025', informe: 'Informe de progreso II',        estado: 'En Tratamiento' },
  { id: 5, paciente: 'Sofía Valencia', rut: '23.049.324-k', fecha: '23-01-2025', informe: 'Recomendaciones en casa',       estado: 'En Seguimiento' },
  { id: 6, paciente: 'Marcos Ruiz',    rut: '20.000.234-0', fecha: '15-05-2025', informe: 'Evaluación de nuevas pautas',  estado: 'En Evaluación' },
  { id: 7, paciente: 'Lucía Gutiérrez',rut: '21.234.412-8', fecha: '20-05-2025', informe: 'Informe de coordinación motora',estado: 'En Tratamiento' },
];

const mockUsuarios = [
  { id: 'todos', nombre: 'Todos' },
  ...mockReportes.map(r => ({ id: String(r.id), nombre: r.paciente })),
];

const Reportes: React.FC = () => {
  const [usuarioFiltro, setUsuarioFiltro] = useState<string>('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reporteSel, setReporteSel] = useState<Reporte | null>(null);

  const reportesFiltrados = mockReportes.filter(
    r => usuarioFiltro === 'todos' || String(r.id) === usuarioFiltro
  );

  const abrirModal = (r: Reporte) => {
    setReporteSel(r);
    setModalAbierto(true);
  };
  const cerrarModal = () => {
    setModalAbierto(false);
    setReporteSel(null);
  };

  return (
    <div className="reportes-page-wrapper">
      <Header />

      <div className="reportes-background">
        <div className="reportes-content">
          <div className="reportes-header">
            <h1>Reportes e Informes</h1>
            <div className="reportes-controls">
              <select
                className="filtro-usuario"
                value={usuarioFiltro}
                onChange={e => setUsuarioFiltro(e.target.value)}
              >
                {mockUsuarios.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
                  </option>
                ))}
              </select>
              <button className="btn-descargar-todos">
                <FaFileAlt /> Descargar todos
              </button>
            </div>
          </div>

          <table className="tabla-reportes">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Rut</th>
                <th>Fecha Informe</th>
                <th>Informe</th>
                <th>Ver Detalle</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map(r => (
                <tr key={r.id}>
                  <td>{r.paciente}</td>
                  <td>{r.rut}</td>
                  <td>{r.fecha}</td>
                  <td>{r.informe}</td>
                  <td>
                    <button
                      className="btn-ver-informe"
                      onClick={() => abrirModal(r)}
                    >
                      <FaEye /> Ver informe
                    </button>
                  </td>
                  <td>
                    <span
                      className={`badge estado-${r.estado
                        .replace(/\s+/g, '')
                        .toLowerCase()}`}
                    >
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && reporteSel && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Informe</h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </header>
            <div className="modal-body">
              <div className="modal-row">
                <label>Paciente</label>
                <input type="text" readOnly value={reporteSel.paciente} />
              </div>
              <div className="modal-row">
                <label>RUT</label>
                <input type="text" readOnly value={reporteSel.rut} />
              </div>
              <div className="modal-row">
                <label>Fecha Informe</label>
                <input type="text" readOnly value={reporteSel.fecha} />
              </div>
              <div className="modal-row">
                <label>Informe</label>
                <textarea readOnly value={reporteSel.informe} />
              </div>
            </div>
            <footer className="modal-footer">
              <button className="btn-pdf">Descargar en PDF</button>
              <button className="btn-xls">Descargar en Excel</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;

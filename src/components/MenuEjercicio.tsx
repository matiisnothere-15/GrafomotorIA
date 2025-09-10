import React, { useState } from 'react';
import './MenuEjercicio.css';
import { CgMenu, CgChevronLeft, CgRedo, CgArrowLeft, CgPen, CgArrowsH } from 'react-icons/cg';

interface Props {
  onReiniciar: () => void;
  onVolverSeleccion: () => void;
  onCambiarAncho: (ancho: number) => void;
  onCambiarPosicionFigura?: (posicion: 'izquierda' | 'derecha') => void;
  posicionFigura?: 'izquierda' | 'derecha';
  mostrarOpcionPosicion?: boolean;
}

const MenuEjercicio: React.FC<Props> = ({ 
  onReiniciar, 
  onVolverSeleccion, 
  onCambiarAncho, 
  onCambiarPosicionFigura,
  posicionFigura = 'izquierda',
  mostrarOpcionPosicion = false
}) => {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {!abierto && (
        <button className="hamburguesa" onClick={() => setAbierto(true)}>
          <CgMenu size={24} />
        </button>
      )}

      <div className={`menu-ejercicio ${abierto ? 'abierto' : ''}`}>
        <button className="cerrar" onClick={() => setAbierto(false)}>
          <CgChevronLeft size={28} />
        </button>

        <ul>
          <li onClick={onReiniciar}>
            <CgRedo size={18} color="#e30613" />
            Reiniciar ejercicio
          </li>
          <li onClick={onVolverSeleccion}>
            <CgArrowLeft size={18} color="#e30613" />
            Volver a selección
          </li>
          <li>
            <div className="control-lapiz">
              <label>
                <CgPen size={18} color="#e30613" /> Ancho del lápiz:
              </label>
              <input
                type="range"
                min="2"
                max="6"
                step="2"
                onChange={(e) => onCambiarAncho(Number(e.target.value))}
              />
              <div className="etiquetas-grosor">
                <span>Fino</span>
                <span>Medio</span>
                <span>Grueso</span>
              </div>
            </div>
          </li>
          {mostrarOpcionPosicion && onCambiarPosicionFigura && (
            <li>
              <div className="control-posicion">
                <label>
                  <CgArrowsH size={18} color="#e30613" /> Posición de la figura:
                </label>
                <div className="opciones-posicion">
                  <button 
                    className={`btn-posicion ${posicionFigura === 'izquierda' ? 'activo' : ''}`}
                    onClick={() => onCambiarPosicionFigura('izquierda')}
                  >
                    Izquierda
                  </button>
                  <button 
                    className={`btn-posicion ${posicionFigura === 'derecha' ? 'activo' : ''}`}
                    onClick={() => onCambiarPosicionFigura('derecha')}
                  >
                    Derecha
                  </button>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default MenuEjercicio;

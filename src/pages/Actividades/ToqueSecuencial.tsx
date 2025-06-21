import React, { useEffect, useState, useRef } from 'react';
import './ToqueSecuencial.css';
import click from '../../assets/sonidos/click.mp3';
import Stars from '../../components/Stars';

const coloresBase = ['#FF4C4C', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#00BCD4'];

const ToqueSecuencial: React.FC = () => {
  const [cantidadCirculos, setCantidadCirculos] = useState(4);
  const [secuencia, setSecuencia] = useState<number[]>([]);
  const [usuarioInput, setUsuarioInput] = useState<number[]>([]);
  const [jugando, setJugando] = useState(false);
  const [mostrandoSecuencia, setMostrandoSecuencia] = useState(false);
  const [activo, setActivo] = useState<number | null>(null);
  const [ronda, setRonda] = useState(1);
  const [tiempo, setTiempo] = useState(30);
  const [posiciones, setPosiciones] = useState<{ top: string; left: string }[]>([]);
  const [popupMensaje, setPopupMensaje] = useState('');

  const [tiempoInicioRonda, setTiempoInicioRonda] = useState<number | null>(null);
  const [tiemposPorRonda, setTiemposPorRonda] = useState<number[]>([]);
  const [reintentos, setReintentos] = useState(0);
  const [rondasCompletadas, setRondasCompletadas] = useState(0);

  const intervaloRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(click);
  }, []);

  const generarPaso = () => Math.floor(Math.random() * cantidadCirculos);

  const generarPosiciones = () => {
    const nuevas: { top: string; left: string }[] = [];
    const diametro = 80;
    const margen = 10;
    const separacion = 90;
    const maxIntentos = 1000;
    const offsetSuperior = 120; // evita cubrir la cabecera
    let intentos = 0;

    for (let i = 0; i < cantidadCirculos; i++) {
      let valido = false;
      let x = 0, y = 0;

      while (!valido && intentos < maxIntentos) {
        x = Math.random() * (window.innerWidth - diametro - 2 * margen) + margen;
        y = Math.random() * (window.innerHeight - diametro - 2 * margen - offsetSuperior) + margen + offsetSuperior;

        valido = !nuevas.some(pos => {
          const dx = parseFloat(pos.left) - x;
          const dy = parseFloat(pos.top) - y;
          return Math.sqrt(dx * dx + dy * dy) < separacion;
        });

        intentos++;
      }

      nuevas.push({ top: `${y}px`, left: `${x}px` });
    }

    setPosiciones(nuevas);
  };

  const mostrarSecuencia = async (seq: number[]) => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setMostrandoSecuencia(true);
    await new Promise(res => setTimeout(res, 2000));
    for (const i of seq) {
      setActivo(i);
      await new Promise(res => setTimeout(res, 600));
      setActivo(null);
      await new Promise(res => setTimeout(res, 300));
    }
    setTiempoInicioRonda(Date.now());
    setMostrandoSecuencia(false);
  };

  const iniciarContador = () => {
    setTiempo(30);
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(() => {
      setTiempo(prev => {
        if (prev <= 1) {
          clearInterval(intervaloRef.current!);
          terminarJuego('⏱️ Se acabó el tiempo. Intenta otra vez.');
        }
        return prev - 1;
      });
    }, 1000);
  };

  const iniciarJuego = async () => {
    setCantidadCirculos(4);
    setRonda(1);
    setReintentos(0);
    setRondasCompletadas(0);
    setTiemposPorRonda([]);
    setPopupMensaje('');
    const primerPaso = [generarPaso()];
    setSecuencia(primerPaso);
    setUsuarioInput([]);
    setJugando(true);
    generarPosiciones();
    await mostrarSecuencia(primerPaso);
    iniciarContador();
  };

  const avanzarRonda = async () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    if (tiempoInicioRonda) {
      const fin = Date.now();
      const duracion = (fin - tiempoInicioRonda) / 1000;
      setTiemposPorRonda(prev => [...prev, duracion]);
      setRondasCompletadas(prev => prev + 1);
    }

    const nuevaRonda = ronda + 1;
    if (nuevaRonda > 15) {
      terminarJuego('🎉 ¡Bien hecho! Has completado las 15 rondas.');
      return;
    }

    if (nuevaRonda % 3 === 1 && cantidadCirculos < coloresBase.length) {
      setCantidadCirculos(c => c + 1);
    }

    const nuevaSecuencia = [...secuencia, generarPaso()];
    setSecuencia(nuevaSecuencia);
    setRonda(nuevaRonda);
    setUsuarioInput([]);
    generarPosiciones();
    await mostrarSecuencia(nuevaSecuencia);
    iniciarContador();
  };

  const terminarJuego = (mensaje: string) => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setPopupMensaje(mensaje);
    setJugando(false);
    setActivo(null);
    setMostrandoSecuencia(false);
    setReintentos(prev => prev + 1);
  };

  const manejarClick = async (index: number) => {
    if (!jugando || mostrandoSecuencia) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    const nuevoInput = [...usuarioInput, index];
    setUsuarioInput(nuevoInput);

    if (secuencia[nuevoInput.length - 1] !== index) {
      terminarJuego('❌ Te equivocaste. Presiona "Comenzar" para reiniciar.');
      return;
    }

    if (nuevoInput.length === secuencia.length) {
      await new Promise(res => setTimeout(res, 500));
      avanzarRonda();
    }
  };

  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  return (
    <div className="toque-wrapper">
      {!jugando && <h2 className="titulo">Toque Secuencial</h2>}
      <div className={`info-superior ${jugando ? 'jugando' : ''}`}>
        <p className="ronda">Ronda: {ronda}</p>
        <p className="contador">Tiempo: {tiempo}s</p>
      </div>

      {jugando &&
        Array.from({ length: cantidadCirculos }).map((_, i) => (
          <button
            key={i}
            className={`circulo ${activo === i ? 'activo' : ''}`}
            style={{
              backgroundColor: coloresBase[i],
              top: posiciones[i]?.top,
              left: posiciones[i]?.left,
            }}
            onClick={() => manejarClick(i)}
          />
        ))}

      {!jugando && (
        <button className="boton-jugar" onClick={iniciarJuego}>
          Comenzar
        </button>
      )}

      {popupMensaje && (
        <div className="popup">
          <div className="popup-contenido">
            <p>{popupMensaje}</p>

            {tiemposPorRonda.length > 0 && (() => {
              const tiempoTotal = tiemposPorRonda.reduce((a, b) => a + b, 0);
              const tiempoMax = rondasCompletadas * 30;
              const exactitud = rondasCompletadas / (rondasCompletadas + reintentos);
              const eficiencia = 1 - tiempoTotal / tiempoMax;
              const porcentajeNum = Math.max(0, Math.min(100, exactitud * 100 * eficiencia));
              //const porcentaje = porcentajeNum.toFixed(1);

              let color = 'rojo';
              if (porcentajeNum >= 80) color = 'verde';
              else if (porcentajeNum >= 50) color = 'amarillo';

              return (
                <div className="resumen-juego">
                  <p><strong>Tiempo total:</strong> {tiempoTotal.toFixed(1)}s</p>
                  <p><strong>Rondas completadas:</strong> {rondasCompletadas}</p>
                  <p><strong>Veces que reiniciaste:</strong> {reintentos}</p>
                  <p><div className={`porcentaje ${color}`}><Stars porcentaje={porcentajeNum}></Stars></div></p>
                </div>
              );
            })()}

            <button className="boton-cerrar" onClick={iniciarJuego}>Comenzar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToqueSecuencial;

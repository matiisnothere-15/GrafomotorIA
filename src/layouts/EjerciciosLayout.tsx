import React, { useEffect } from "react";
import { Outlet, useBlocker, useNavigate } from "react-router-dom";
import { useGlobalPaciente } from '../context/PacienteContext';

const EJERCICIOS_PATHS = [
  "/actividades",
  "/actividad/CopiaFigura",
  "/actividad/trazado-guiado",
  "/actividad/toque-secuencial",
  "/figuras",
  "/copiar-figura",
  "/trazados",
  "/trazado-guiado",
];

function useConfirmExit(message: string) {
  const navigate = useNavigate();
  const { setGlobalPaciente } = useGlobalPaciente();

  const blocker = useBlocker(({ nextLocation }) => {
    // Bloquea solo si la próxima ruta NO pertenece a ejercicios
    const isExiting = !EJERCICIOS_PATHS.some(path =>
      nextLocation.pathname.startsWith(path)
    );
    return isExiting;
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmExit = window.confirm(message);
      if (confirmExit) {
        blocker.proceed();
        setGlobalPaciente("", "")
        sessionStorage.clear();
        localStorage.removeItem("fotoPerfil");
        navigate('/');
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
}

const EjerciciosLayout: React.FC = () => {
  useConfirmExit("⚠️ Vas a salir de la sección de ejercicios, la sesión finalizará y no podrás volver a iniciar ¿quieres continuar?");

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return <Outlet />;
};

export default EjerciciosLayout;
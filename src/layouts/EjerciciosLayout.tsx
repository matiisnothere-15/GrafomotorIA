/* Corregir para bloquear las cargas a las páginas del paciente en caso de que se salga de las paginas de ejercicios
import React, { useContext, useEffect } from "react";
import { Outlet, UNSAFE_NavigationContext } from "react-router-dom";

// Hook para bloquear navegación
function useBlocker(blocker: () => boolean, when: boolean = true) {
  const { navigator } = useContext(UNSAFE_NavigationContext) as {
    navigator: { push: (...args: any[]) => void };
  };

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    navigator.push = (...args: any[]) => {
      const allowTransition = blocker();
      if (allowTransition) {
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [blocker, when, navigator]);
}

const EjerciciosLayout: React.FC = () => {
  // Confirmación al cambiar de página dentro de la app
  useBlocker(() => {
    return window.confirm(
      "⚠️ Vas a salir de la sección de ejercicios, ¿quieres continuar?"
    );
  }, true);

  // Confirmación al cerrar pestaña o recargar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <Outlet />; // Renderiza la subruta activa
};

export default EjerciciosLayout;
*/
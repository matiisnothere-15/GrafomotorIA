import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type PacienteContextType = {
  id: string | null;
  nombre: string | null;
  setGlobalPaciente: (id: string, nombre: string) => void;
  limpiarPaciente: () => void;
};

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

export const PacienteProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);

  const setGlobalPaciente = (id: string, nombre: string) => {
    setId(id);
    setNombre(nombre);
  };

  const limpiarPaciente = () => {
    setId(null);
    setNombre(null);
  };

  return (
    <PacienteContext.Provider value={{ id, nombre, setGlobalPaciente, limpiarPaciente }}>
      {children}
    </PacienteContext.Provider>
  );
};

export const useGlobalPaciente = () => {
  const context = useContext(PacienteContext);
  if (!context) throw new Error("usePaciente debe usarse dentro de PacienteProvider");
  return context;
};
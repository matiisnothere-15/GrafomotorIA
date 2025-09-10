import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

// Auth
import Login from "../pages/Auth/Login";
import PasswordRecovery from "../pages/Auth/PasswordRecovery";

// Dashboard
import Home from "../pages/Home/Home";
import Seguimientos from "../pages/Sesiones/seguimiento";

// Actividades
import Actividades from "../pages/Actividades/Actividades";
import CopiaFigura from "../pages/Actividades/CopiaFigura";
import TrazadoGuiado from "../pages/Actividades/TrazadoGuiado";
import ToqueSecuencial from "../pages/Actividades/ToqueSecuencial";
import SeleccionFigura from "../pages/Actividades/SeleccionFigura";
import SeleccionTrazado from "../pages/Actividades/SeleccionNivelTrazado";

// Sesiones
import Sesion from "../pages/Sesiones/Sesion";

// Plan de Tratamiento
import PlanTratamientoPage from "../pages/Plantratamiento/PlanTratamiento";

// Calendario
import Calendario from "../pages/Calendario/Calendario";
import VerSesiones from "../pages/Calendario/VerSesiones";

// Perfil y Config
import Perfil from "../pages/Perfil/Perfil";
import Configuracion from "../pages/configuracion/Configuracion";
import Contactanos from "../pages/Contacto/Contactanos";

// Components
import PrivateRoute from "../components/PrivateRoute";
import PrivatePacienteRoute from "../components/PrivatePacienteRoute";

// Layout
import EjerciciosLayout from "../layouts/EjerciciosLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />

      {/* Layout para ejercicios */}
      <Route element={<EjerciciosLayout />}>
        <Route path="/actividades" element={<PrivatePacienteRoute><Actividades /></PrivatePacienteRoute>} />

        {/* Selección y ejecución de CopiaFigura */}
        <Route path="/figuras" element={<PrivatePacienteRoute><SeleccionFigura /></PrivatePacienteRoute>} />
        <Route path="/actividad/CopiaFigura" element={<PrivateRoute><CopiaFigura /></PrivateRoute>} />
        <Route path="/copiar-figura/:nivel/:figura" element={<PrivatePacienteRoute><CopiaFigura /></PrivatePacienteRoute>} />

        {/* Selección y ejecución de TrazadoGuiado */}
        <Route path="/trazados" element={<PrivatePacienteRoute><SeleccionTrazado /></PrivatePacienteRoute>} />
        <Route path="/trazado-guiado/:nivel/:figura" element={<PrivatePacienteRoute><TrazadoGuiado /></PrivatePacienteRoute>} />
        <Route path="/actividad/trazado-guiado" element={<PrivatePacienteRoute><SeleccionTrazado /></PrivatePacienteRoute>} />

        {/* Selección y ejecución de Toque Secuencial */}
        <Route path="/actividad/toque-secuencial" element={<PrivatePacienteRoute><ToqueSecuencial /></PrivatePacienteRoute>} />

      </Route>

      {/* Rutas protegidas */}
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

      <Route path="/PlanTratamiento" element={<PrivateRoute><PlanTratamientoPage /></PrivateRoute>} />

      <Route path="/Contactanos" element={<PrivateRoute><Contactanos /></PrivateRoute>} />

      <Route path="/Sesion" element={<PrivateRoute><Sesion /></PrivateRoute>} />

      <Route path="/Calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />

      <Route path="/Seguimientos" element={<PrivateRoute><Seguimientos /></PrivateRoute>} />

      <Route path="/ver-sesiones" element={<VerSesiones />} />

      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

      <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />

    </>
  ),
  {
    basename: "/GrafomotorIA"
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
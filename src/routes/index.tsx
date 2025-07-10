import { Routes, Route } from 'react-router-dom';

// Auth
import Login from '../pages/Auth/Login';
import PasswordRecovery from '../pages/Auth/PasswordRecovery';
// import RestablecerContrasena from '../pages/Auth/RestablecerContrasena';

// Dashboard
import Home from '../pages/Home/Home';
import Seguimientos from '../pages/Sesiones/seguimiento';

// Actividades
import Actividades from '../pages/Actividades/Actividades';
import CopiaFigura from '../pages/Actividades/CopiaFigura';
import TrazadoGuiado from '../pages/Actividades/TrazadoGuiado';
import ToqueSecuencial from '../pages/Actividades/ToqueSecuencial';
import SeleccionFigura from '../pages/Actividades/SeleccionFigura';
import SeleccionTrazado from '../pages/Actividades/SeleccionNivelTrazado';

// Sesiones
import Sesion from '../pages/Sesiones/Sesion';

// Plan de Tratamiento
import PlanTratamientoPage from '../pages/Plantratamiento/PlanTratamiento';

// Calendario
import Calendario from '../pages/Calendario/Calendario';
import VerSesiones from '../pages/Calendario/VerSesiones';

// Perfil y Config
import Perfil from '../pages/Perfil/Perfil';
import Configuracion from '../pages/configuracion/Configuracion';
import Contactanos from '../pages/Contacto/Contactanos';

// Componente de autenticación
import PrivateRoute from '../components/PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
      {/* <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} /> */}

      {/* Rutas protegidas */}
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/actividades" element={<PrivateRoute><Actividades /></PrivateRoute>} />
      <Route path="/PlanTratamiento" element={<PrivateRoute><PlanTratamientoPage /></PrivateRoute>} />
      <Route path="/actividad/CopiaFigura" element={<PrivateRoute><CopiaFigura /></PrivateRoute>} />
      
      {/* CORREGIDA ESTA LÍNEA */}
      <Route path="/actividad/trazado-guiado" element={<PrivateRoute><SeleccionTrazado /></PrivateRoute>} />
      
      <Route path="/Contactanos" element={<PrivateRoute><Contactanos /></PrivateRoute>} />
      <Route path="/Sesion" element={<PrivateRoute><Sesion /></PrivateRoute>} />
      <Route path="/Calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
      <Route path="/Seguimientos" element={<PrivateRoute><Seguimientos /></PrivateRoute>} />
      <Route path="/ver-sesiones" element={<VerSesiones />} />
      <Route path="/actividad/toque-secuencial" element={<ToqueSecuencial />} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />

      {/* Selección y ejecución de CopiaFigura */}
      <Route path="/figuras" element={<PrivateRoute><SeleccionFigura /></PrivateRoute>} />
      <Route path="/copiar-figura/:nivel/:figura" element={<PrivateRoute><CopiaFigura /></PrivateRoute>} />

      {/* Selección y ejecución de TrazadoGuiado */}
      <Route path="/trazados" element={<PrivateRoute><SeleccionTrazado /></PrivateRoute>} />
      <Route path="/trazado-guiado/:nivel/:figura" element={<PrivateRoute><TrazadoGuiado /></PrivateRoute>} />
    </Routes>
  );
}

export default AppRoutes;

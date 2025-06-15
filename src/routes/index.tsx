import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
// import RestablecerContrasena from '../pages/RestablecerContrasena';

import Home from '../pages/Home';
import Actividades from '../pages/Actividades';
import Reportes from '../pages/Reportes';
import PlanTratamientoPage from '../pages/PlanTratamiento';
import CopiaFigura from '../pages/CopiaFigura';
import Contactanos from '../pages/Contactanos';
import Sesion from '../pages/Sesion';
import TrazadoGuiado from '../pages/TrazadoGuiado';
import Calendario from '../pages/Calendario';
import Seguimientos from '../pages/Follow-ups';
import Perfil from '../pages/Perfil';
import PrivateRoute from '../components/PrivateRoute';
import ToqueSecuencial from '../pages/ToqueSecuencial';
import Configuracion from '../pages/Configuracion';
import VerSesiones from '../pages/VerSesiones';


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
      <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
      <Route path="/PlanTratamiento" element={<PrivateRoute><PlanTratamientoPage /></PrivateRoute>} />
      <Route path="/actividad/CopiaFigura" element={<PrivateRoute><CopiaFigura /></PrivateRoute>} />
       <Route path="/actividad/trazado-guiado" element={<PrivateRoute><TrazadoGuiado /></PrivateRoute>} />
      <Route path="/Contactanos" element={<PrivateRoute><Contactanos /></PrivateRoute>} />
      <Route path="/Sesion" element={<PrivateRoute><Sesion /></PrivateRoute>} />
      <Route path="/Calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
      <Route path="/Seguimientos" element={<PrivateRoute><Seguimientos /></PrivateRoute>} />
      <Route path="/ver-sesiones" element={<VerSesiones />} />
      <Route path="/actividad/toque-secuencial" element={<ToqueSecuencial />} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
    </Routes>
  );
}

export default AppRoutes;
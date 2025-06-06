import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
// import RestablecerContrasena from '../pages/RestablecerContrasena';

import Home from '../pages/Home';
import Actividades from '../pages/Actividades';
import Reportes from '../pages/Reportes';
import PlanTratamientoPage from '../pages/PlanTratamiento';
import CopiaFigura from '../pages/CopiaFigura';
import AyudaSoporte from '../pages/AyudaSoporte';
import Sesion from '../pages/Sesion';
import Calendario from '../pages/Calendario';
import Seguimientos from '../pages/Follow-ups';
import PrivateRoute from '../components/PrivateRoute';
import ToqueSecuencial from '../pages/ToqueSecuencial';


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
      <Route path="/AyudaSoporte" element={<PrivateRoute><AyudaSoporte /></PrivateRoute>} />
      <Route path="/Sesion" element={<PrivateRoute><Sesion /></PrivateRoute>} />
      <Route path="/Calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
      <Route path="/Seguimientos" element={<PrivateRoute><Seguimientos /></PrivateRoute>} />
      <Route path="/actividad/toque-secuencial" element={<ToqueSecuencial />} />
    </Routes>
  );
}

export default AppRoutes;

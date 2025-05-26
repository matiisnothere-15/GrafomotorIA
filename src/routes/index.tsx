import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import Home from '../pages/Home';
import Actividades from '../pages/Actividades';
import Reportes from '../pages/Reportes';
import RestablecerContrasena from '../pages/RestablecerContrasena';
import PrivateRoute from '../components/PrivateRoute';
import PlanTratamientoPage from '../pages/PlanTratamiento';
import CopiaFigura from '../pages/CopiaFigura';
import AyudaSoporte from '../pages/AyudaSoporte';
import Sesion from '../pages/Sesion';


function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/PlanTratameinto" element={<PlanTratamientoPage />} />
      <Route path="/CopiaFigura" element={<CopiaFigura />} />
      <Route path="/AyudaSoporte" element={<AyudaSoporte />} />
      <Route path="/Sesion" element={<Sesion />} />

      {/* Rutas protegidas */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/actividades"
        element={
          <PrivateRoute>
            <Actividades />
          </PrivateRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <PrivateRoute>
            <Reportes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;

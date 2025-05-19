import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import Home from '../pages/Home';
import Actividades from '../pages/Actividades';
import RestablecerContrasena from '../pages/RestablecerContrasena';
import PrivateRoute from '../components/PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
      <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
      

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
    </Routes>
  );
}

export default AppRoutes;

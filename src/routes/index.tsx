import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import Home from '../pages/Home';
import Actividades from '../pages/Actividades';
import PrivateRoute from '../components/PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="home/actividades" element={
        <PrivateRoute>
          <Actividades />
        </PrivateRoute>
      } />

      {/* Aquí se agergan  más rutas luego */}
    </Routes>
  );
}

export default AppRoutes;

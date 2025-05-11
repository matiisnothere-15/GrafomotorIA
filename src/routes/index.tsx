import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import Home from '../pages/Home';
import Actividades from '../pages/Actividades';
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recuperar" element={<PasswordRecovery />} />
      <Route path="/home" element={<Home />} />
      <Route path="/actividades" element={<Actividades />} />

      {/* Aquí se agergan  más rutas luego */}
    </Routes>
  );
}

export default AppRoutes;

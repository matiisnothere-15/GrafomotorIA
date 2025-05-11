import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import Home from '../pages/Home';
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recuperar" element={<PasswordRecovery />} />
      <Route path="/home" element={<Home />} />
      {/* Aquí se agergan  más rutas luego */}
    </Routes>
  );
}

export default AppRoutes;

import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from './App.tsx';
import './index.css';
//import { HashRouter } from 'react-router-dom'; 
import { registerSW } from 'virtual:pwa-register';
import { PacienteProvider } from './context/PacienteContext.tsx';

import AppRouter from "./routes/AppRouter.tsx";


registerSW({ onNeedRefresh: () => {}, onOfflineReady: () => {} });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Pasamos la información del paciente seleccionado por todas las páginas */}
    <PacienteProvider>
      <AppRouter />
    </PacienteProvider>
  </React.StrictMode>
);

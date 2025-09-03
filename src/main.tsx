import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HashRouter } from 'react-router-dom'; 
import { registerSW } from 'virtual:pwa-register';
import { PacienteProvider } from './context/PacienteContext.tsx';


registerSW({ onNeedRefresh: () => {}, onOfflineReady: () => {} });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      {/* Pasamos la información del paciente seleccionado por todas las páginas */}
      <PacienteProvider>
        <App />
      </PacienteProvider>
    </HashRouter>
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// 👇 **LA OTRA CORRECCIÓN CLAVE:** Usa HashRouter
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

// Registra el Service Worker
registerSW({ onNeedRefresh: () => {}, onOfflineReady: () => {} });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 Envuelve tu App en HashRouter */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
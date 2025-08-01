import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// 👇 **LA OTRA CORRECCIÓN CLAVE:** Usa HashRouter
import { HashRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

// Registra el Service Worker
registerSW({ onNeedRefresh: () => {}, onOfflineReady: () => {} });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 Envuelve tu App en HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
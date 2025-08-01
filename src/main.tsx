import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

// ✅ PWA: Registrar service worker antes o después del render
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    if (confirm("🔄 Hay una nueva versión disponible. ¿Deseas actualizar ahora?")) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log("✅ La aplicación está lista para funcionar sin conexión.")
  },
  onRegisteredSW(swUrl, r) {
    console.log("📦 Service Worker registrado:", swUrl)
  },
  onRegisterError(error) {
    console.error("❌ Error al registrar el Service Worker:", error)
  }
})

// ✅ Render de la app con basename correcto
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/GrafomotorIA">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

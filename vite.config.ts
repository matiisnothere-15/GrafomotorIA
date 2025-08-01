import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // 👇 **LA SOLUCIÓN CLAVE:** Asegura que la app busque sus archivos en /GrafomotorIA/
  base: '/GrafomotorIA/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'GrafomotorIA',
        short_name: 'GrafomotorIA',
        description: 'Aplicación de grafomotricidad para Teletón',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '.',
        start_url: '.',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
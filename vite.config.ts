import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // 👇 CORRECCIÓN: Apuntamos al repositorio correcto.
  base: '/GrafomotorIA/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'pwa-192x192.png', 
        'pwa-512x512.png'  
      ],
      manifest: {
        id: '/GrafomotorIA/',
        name: 'GrafomotorIA',
        short_name: 'Grafomotor',
        description: 'App terapéutica para niños con dificultades grafomotoras.',
        start_url: '.', 
        scope: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#e30613',
        orientation: 'landscape',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
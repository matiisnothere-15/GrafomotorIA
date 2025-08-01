import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({
  base: '/GrafomotorIA/', // 👈 forzar la base para GitHub Pages
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
        scope: '/GrafomotorIA/', // 👈 necesario para que PWA funcione bien en subcarpeta
        start_url: '/GrafomotorIA/', // 👈 igual que arriba
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

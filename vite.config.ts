import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = parseInt(process.env.PORT || '4173', 10)

export default defineConfig({
  plugins: [react()],
  base: '/',
  preview: {
    host: '0.0.0.0',
    port,
    allowedHosts: ['grafomotoria.onrender.com'],
  },
})

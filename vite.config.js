import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})

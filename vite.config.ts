import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_PORT = process.env.API_PORT ?? '5181'

export default defineConfig({
  plugins: [react()],
  server: {
    // Keeps the app on a single origin: /api/* is forwarded to the bundle API.
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
})

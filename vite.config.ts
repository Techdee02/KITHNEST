import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Lets the frontend call a same-origin relative path regardless of
      // where it's being accessed from (localhost, a Codespace forwarded
      // URL, etc.) — Vite proxies it to the backend inside the container,
      // sidestepping both CORS and "localhost means my machine, not the
      // container" mismatches entirely.
      '/api': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000',
    },
  },
})

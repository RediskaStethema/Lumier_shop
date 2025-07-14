import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // или '0.0.0.0' — разрешает входящие подключения из сети
    port: 5173, // необязательно, но можно явно указать
  },
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // Allow access from any device on the network
    port: 5173,           // Default Vite port
    strictPort: false,    // Allow fallback to another port if 5173 is taken
  },
})
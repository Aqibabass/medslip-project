import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  resolve: {
    conditions: ['development', 'browser'],
    preserveSymlinks: true
  },
  server: {
    port: 5174,
    host: true
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   base: '/client/auth/login',
   resolve: {
    alias: {
      "@": "/src", // Direct alias path for the src directory
    },
  },
})

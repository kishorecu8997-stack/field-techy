import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  resolve: {
    alias: {
      "@": "/src", // Direct alias path for the src directory
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@headlessui/react",
            "@mui/icons-material",
            "lucide-react",
            "react-icons",
          ],
          utils: ["axios", "dayjs", "zod", "zustand"],
          pdf: [
            "pdfjs-dist",
            "@react-pdf-viewer/core",
            "@react-pdf-viewer/default-layout",
          ],
          maps: ["leaflet", "react-leaflet"],
          editors: ["quill", "react-quill-new"],
          charts: ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const pwaPlugin = VitePWA({
  registerType: "autoUpdate",
  injectRegister: "auto",
  devOptions: {
    enabled: true,
  },
  includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
  manifest: {
    name: "Field Techy",
    short_name: "Field Techy",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 3000000,
    runtimeCaching: [
      // JS / TS scripts
      {
        urlPattern: ({ request }) => request.destination === "script",
        handler: "CacheFirst",
        options: {
          cacheName: "app-shell",
          expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
        },
      },
      // CSS
      {
        urlPattern: ({ request }) => request.destination === "style",
        handler: "CacheFirst",
        options: {
          cacheName: "styles",
          expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
        },
      },
      // Images
      {
        urlPattern: ({ request }) => request.destination === "image",
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pwaPlugin],
  base: "/",
  resolve: {
    alias: {
      "@": "/src", // Direct alias path for the src directory
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
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

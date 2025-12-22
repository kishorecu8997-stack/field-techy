import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "My App",
        short_name: "App",
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
          // Entire assets folder (fonts, JSON, etc.)
          {
            urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/assets/"),
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  base: "/",
  server: { open: `/engineer/auth/login` },
  resolve: { alias: { "@": "/src" } },
});

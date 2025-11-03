// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {  
  
  return {
    plugins: [react(), tailwindcss()],
    base:  "/",
    server: {
      open:  "/client/auth/login", // opens correct dev URL
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
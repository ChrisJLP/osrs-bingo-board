// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/solo-board": {
        target: "http://localhost:5001", // adjust to your backend's URL and port
        changeOrigin: true,
      },
    },
  },
});

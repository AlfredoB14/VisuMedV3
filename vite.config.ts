import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),],
  server: {
    proxy: {
      "/api": {
        target: "https://visumeddjango-production.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

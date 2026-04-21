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
        // In local dev, proxy to the local Django server so <img src="/api/..."> works.
        // axios calls use VITE_API_URL directly and bypass this proxy.
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

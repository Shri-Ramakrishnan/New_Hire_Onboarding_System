import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

/** @type {import('vite').UserConfigExport} */
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve", // Only during dev
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}

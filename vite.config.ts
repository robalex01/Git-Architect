import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'renderer'),
  // Base relative : indispensable pour que l'app packagée (chargée via
  // file://) retrouve les assets buildés (sinon chemins absolus "/assets/..").
  base: './',
  build: {
    // Doit correspondre au chemin lu par electron/main/index.ts
    // (path.join(__dirname, '..', '..', '..', 'renderer', 'dist', 'index.html'))
    outDir: path.resolve(__dirname, 'renderer', 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

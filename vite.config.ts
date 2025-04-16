import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { createManualChunks } from './src/manual-chunks'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      cy: path.resolve(__dirname, './cypress'),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },

  build: {
    rollupOptions: {
      external: ['bufferutil', 'utf-8-validate'],
      output: {
        manualChunks: createManualChunks,
      },
    },
  },
}))

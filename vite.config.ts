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
  build: {
    rollupOptions: {
      external: ['bufferutil', 'utf-8-validate'],
      output: {
        manualChunks: createManualChunks,
      },
    },
  },
}))

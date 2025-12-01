import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { createManualChunks } from './src/manual-chunks'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      cy: path.resolve(__dirname, './cypress'),
    },
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      external: ['bufferutil', 'utf-8-validate'],
      output: {
        manualChunks: createManualChunks,
      },
    },
  },
})

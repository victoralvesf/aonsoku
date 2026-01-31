import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'
import { createManualChunks } from './src/manual-chunks'

export default defineConfig({
  main: {
    build: {
      minify: 'terser',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts'),
        },
      },
      externalizeDeps: {
        exclude: [
          '@electron-toolkit/utils',
          'electron-store',
          'electron-dl',
          'electron-updater',
          'discord-rpc',
        ],
      },
    },
  },
  preload: {
    build: {
      minify: 'terser',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts'),
        },
      },
      externalizeDeps: {
        exclude: ['@electron-toolkit/preload'],
      },
    },
  },
  renderer: {
    root: '.',
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      minify: 'terser',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: createManualChunks,
        },
      },
    },
  },
})

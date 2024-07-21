import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})

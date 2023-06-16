import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:2999' }
    }
  }
})

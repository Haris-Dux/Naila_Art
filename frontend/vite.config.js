import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    proxy: {
      '/api': 'http://31.220.109.115:5000',
    },

  },
  plugins: [react()],
})

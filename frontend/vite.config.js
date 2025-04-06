import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = '';

// https://vitejs.dev/config/
export default defineConfig({

  

  server: {
    
    proxy: {
      '/api': ''
    },

  },
  plugins: [react()],
})

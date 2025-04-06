import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = process.env.VITE_API_URL;

console.log('API_URL IN CONFIG:', API_URL);

// https://vitejs.dev/config/
export default defineConfig({

  

  server: {
    
    proxy: {
      '/api': {
        target:API_URL,
        changeOrigin: true,
      },
    },

  },
  plugins: [react()],
})

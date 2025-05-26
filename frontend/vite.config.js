import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  plugins: [react()],
})

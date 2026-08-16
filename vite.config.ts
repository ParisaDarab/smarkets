import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'https://api.smarkets.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/src/test/e2e/**',
  ],
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
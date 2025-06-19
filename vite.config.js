import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '18.158.237.149',
    port: '8003',
  },
  plugins: [tailwindcss()],
});


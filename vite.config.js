import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '10.0.60.24',
    port: '3000',
  },
  plugins: [tailwindcss()],
});

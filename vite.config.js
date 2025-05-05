import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '10.0.60.24',
    port: '8000',
  },
  plugins: [tailwindcss()],
});

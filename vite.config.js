// import { defineConfig } from 'vite';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   server: {
//     host: '0.0.0.0',
//     port: '8000',
//   },
//   plugins: [tailwindcss()],
// });
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd'],
  },
  server: {
    host: '0.0.0.0',
    // port: 8003,
    port: 8000,
  },
  preview: {
    host: '0.0.0.0',
    // port: 8003,
    port: 8000,
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        defaultHandler(warning);
      }
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/public/icons/**'],
    },
  },
  build: {
    emptyOutDir: false,
    // Increase chunk size warning limit for large icon data
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          utils: ['jszip', 'file-saver', 'fuse.js'],
          window: ['react-window', 'react-virtualized-auto-sizer'],
        },
      },
    },
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-window', 'zustand'],
  },
});

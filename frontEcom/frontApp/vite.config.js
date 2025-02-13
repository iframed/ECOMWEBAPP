import { defineConfig } from 'vite';
import { VitePluginNodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    VitePluginNodePolyfills()
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      'path': 'path-browserify',
      'url': 'url',
      'fs': 'browserify-fs',
      'http': 'stream-http'
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});
